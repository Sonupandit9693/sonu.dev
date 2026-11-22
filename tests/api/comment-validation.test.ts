import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createFakePrisma, users } from "../helpers/fake-prisma"
import { createFakeRateLimitStore } from "../helpers/fake-rate-limit-store"

const state = vi.hoisted(() => {
  process.env.UPSTASH_REDIS_REST_URL = "http://127.0.0.1:1"
  process.env.UPSTASH_REDIS_REST_TOKEN = "unused-test-token"
  return {
    prisma: null as unknown,
    session: null as { user: { id: string; email: string } } | null,
    store: null as unknown as { eval: (script: string, keys: string[], args: string[]) => Promise<unknown> },
  }
})

vi.mock("@upstash/redis", () => ({
  Redis: class {
    eval(script: string, keys: string[], args: string[]) {
      return state.store.eval(script, keys, args)
    }
  },
}))
vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return state.prisma
  },
}))
vi.mock("@/lib/auth", () => ({ authOptions: {} }))
vi.mock("next-auth", () => ({ getServerSession: vi.fn(async () => state.session) }))

import { POST as createComment } from "@/app/api/posts/[slug]/comments/route"
import { PUT as updateComment } from "@/app/api/posts/[slug]/comments/[commentId]/route"

let fake: ReturnType<typeof createFakePrisma>

beforeEach(() => {
  fake = createFakePrisma()
  state.prisma = fake
  state.store = createFakeRateLimitStore()
  state.session = { user: { id: users.commenter.id, email: users.commenter.email } }
})

afterEach(() => {
  vi.restoreAllMocks()
})

function rawRequest(body: string, method = "POST") {
  return new Request("http://localhost", { method, headers: { "content-type": "application/json" }, body })
}
const post = (body: unknown, slug = "published-post") =>
  createComment(rawRequest(JSON.stringify(body)), { params: { slug } })
const put = (body: unknown) =>
  updateComment(rawRequest(JSON.stringify(body), "PUT"), { params: { slug: "published-post", commentId: "c_p_published" } })

describe("POST comment validation", () => {
  it.each([
    ["a number", { content: 123 }],
    ["an object", { content: { text: "hi" } }],
    ["missing content", {}],
    ["an empty string", { content: "" }],
    ["whitespace only", { content: "   \n\t " }],
    ["2001 characters", { content: "x".repeat(2001) }],
  ])("rejects %s with 400 and stores nothing", async (_label, body) => {
    const response = await post(body)

    expect(response.status).toBe(400)
    expect(fake.calls["comment.create"]).toBeUndefined()
  })

  it("rejects a body that is not valid JSON with 400", async () => {
    const response = await createComment(rawRequest("{not json"), { params: { slug: "published-post" } })
    expect(response.status).toBe(400)
  })

  it("accepts exactly 2000 characters", async () => {
    expect((await post({ content: "y".repeat(2000) })).status).toBe(201)
  })

  it("stores the trimmed content", async () => {
    await post({ content: "  Great read  " })

    const args = fake.calls["comment.create"][0] as { data: { content: string } }
    expect(args.data.content).toBe("Great read")
  })

  it("returns 404 for comments on a draft, without revealing it exists", async () => {
    const response = await post({ content: "Sneaky" }, "draft-post")

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: "Post not found" })
    expect(fake.calls["comment.create"]).toBeUndefined()
  })

  it("still requires sign-in", async () => {
    state.session = null
    expect((await post({ content: "hi" })).status).toBe(401)
  })

  it("rate-limits to 10 comments per user per window, then 429", async () => {
    for (let i = 0; i < 10; i++) expect((await post({ content: `comment ${i}` })).status).toBe(201)

    const blocked = await post({ content: "one too many" })
    expect(blocked.status).toBe(429)
    expect(fake.calls["comment.create"]).toHaveLength(10)

    // Another user is unaffected.
    state.session = { user: { id: users.other.id, email: users.other.email } }
    expect((await post({ content: "different user" })).status).toBe(201)
  })

  it("fails open when Redis is down: the comment is still accepted", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    state.store = { eval: async () => { throw new Error("down") } }

    expect((await post({ content: "still works" })).status).toBe(201)
  })
})

describe("PUT comment validation", () => {
  it.each([
    ["a number", { content: 42 }],
    ["whitespace only", { content: "   " }],
    ["2001 characters", { content: "z".repeat(2001) }],
  ])("rejects %s with 400 and updates nothing", async (_label, body) => {
    const response = await put(body)

    expect(response.status).toBe(400)
    expect(fake.calls["comment.update"]).toBeUndefined()
  })

  it("stores trimmed content for the owner", async () => {
    const response = await put({ content: "  Edited  " })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ content: "Edited" })
  })

  it("still forbids editing someone else's comment", async () => {
    state.session = { user: { id: users.other.id, email: users.other.email } }
    expect((await put({ content: "Hijack" })).status).toBe(403)
  })
})
