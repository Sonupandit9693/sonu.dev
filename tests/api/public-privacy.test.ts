import { beforeEach, describe, expect, it, vi } from "vitest"
import { createFakePrisma, findKeys, users } from "../helpers/fake-prisma"

const state = vi.hoisted(() => ({
  prisma: null as unknown,
  session: null as { user: { id: string; email: string } } | null,
}))

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return state.prisma
  },
}))
vi.mock("@/lib/auth", () => ({ authOptions: {} }))
vi.mock("next-auth", () => ({ getServerSession: vi.fn(async () => state.session) }))

import { GET as listPosts, POST as createPost } from "@/app/api/posts/route"
import { GET as getPost, PATCH as publishPost } from "@/app/api/posts/[slug]/route"
import { GET as listDrafts } from "@/app/api/posts/drafts/route"
import { POST as createComment } from "@/app/api/posts/[slug]/comments/route"
import { PUT as updateComment } from "@/app/api/posts/[slug]/comments/[commentId]/route"

// Never allowed anywhere in a public response.
const FORBIDDEN = ["email", "password", "authorId", "postId", "userId"]

let fake: ReturnType<typeof createFakePrisma>

function signInAs(userId: string | null) {
  const user = Object.values(users).find((candidate) => candidate.id === userId)
  state.session = user ? { user: { id: user.id, email: user.email } } : null
}

function jsonRequest(url: string, method: string, body: unknown) {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

const slugParams = (slug: string) => ({ params: { slug } })

beforeEach(() => {
  fake = createFakePrisma()
  state.prisma = fake
  signInAs(null)
  // The post author is the admin; other fixture users are not.
  process.env.ADMIN_EMAILS = users.author.email
})

describe("public API contract: no private fields", () => {
  it("GET /api/posts exposes no email, password or ownership IDs, and author has no id", async () => {
    const response = await listPosts()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toHaveLength(1)
    expect(findKeys(body, FORBIDDEN)).toEqual([])
    expect(Object.keys(body[0].author).sort()).toEqual(["image", "name"])
    // Fields the list UI relies on are still present.
    expect(body[0]).toMatchObject({ id: "p_published", slug: "published-post", views: 3 })
    expect(body[0]._count).toEqual({ likes: 2, comments: 1 })
  })

  it("GET /api/posts/:slug strips authorId and all emails, including nested commenters", async () => {
    const response = await getPost(new Request("http://localhost"), slugParams("published-post"))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(findKeys(body, FORBIDDEN)).toEqual([])
    expect(Object.keys(body.author).sort()).toEqual(["image", "name"])
    // Comment UI still needs user.id to decide whether to show Edit/Delete.
    expect(body.comments[0].user).toEqual({ id: users.commenter.id, name: null, image: null })
    expect(body).toMatchObject({ title: "Title published-post", userLiked: false })
  })

  it("POST /api/posts response exposes no private fields and stores the session user as author", async () => {
    signInAs(users.author.id)
    const response = await createPost(jsonRequest("http://localhost/api/posts", "POST", {
      title: "New post",
      content: "Hello world",
      slug: "new-post",
      published: true,
    }))
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(findKeys(body, FORBIDDEN)).toEqual([])
    expect(body.slug).toBe("new-post")
    const createArgs = fake.calls["post.create"][0] as { data: { authorId: string } }
    expect(createArgs.data.authorId).toBe(users.author.id)
  })

  it("POST comment response exposes no email or ownership IDs but keeps user.id", async () => {
    signInAs(users.commenter.id)
    const response = await createComment(
      jsonRequest("http://localhost", "POST", { content: "Great read" }),
      slugParams("published-post"),
    )
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(findKeys(body, FORBIDDEN)).toEqual([])
    expect(body.user.id).toBe(users.commenter.id)
  })

  it("PUT comment response exposes no email or ownership IDs but keeps user.id", async () => {
    signInAs(users.commenter.id)
    const response = await updateComment(
      jsonRequest("http://localhost", "PUT", { content: "Edited" }),
      { params: { slug: "published-post", commentId: "c_p_published" } },
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(findKeys(body, FORBIDDEN)).toEqual([])
    expect(body).toMatchObject({ content: "Edited", user: { id: users.commenter.id } })
  })
})

describe("server-side ownership checks are preserved", () => {
  it("the owner can view their own draft", async () => {
    signInAs(users.author.id)
    const response = await getPost(new Request("http://localhost"), slugParams("draft-post"))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.published).toBe(false)
    expect(findKeys(body, FORBIDDEN)).toEqual([])
  })

  it("a non-owner gets 404 for a draft", async () => {
    signInAs(users.other.id)
    const response = await getPost(new Request("http://localhost"), slugParams("draft-post"))
    expect(response.status).toBe(404)
  })

  it("an anonymous visitor gets 404 for a draft", async () => {
    const response = await getPost(new Request("http://localhost"), slugParams("draft-post"))
    expect(response.status).toBe(404)
  })

  it("the owner can publish their draft", async () => {
    signInAs(users.author.id)
    const response = await publishPost(new Request("http://localhost", { method: "PATCH" }), slugParams("draft-post"))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ slug: "draft-post" })
  })

  it("a non-admin gets 403 when publishing, and nothing is updated", async () => {
    signInAs(users.other.id)
    const response = await publishPost(new Request("http://localhost", { method: "PATCH" }), slugParams("draft-post"))

    expect(response.status).toBe(403)
    expect(fake.calls["post.update"]).toBeUndefined()
  })

  it("an admin who is not the owner gets 404 when publishing, and nothing is updated", async () => {
    process.env.ADMIN_EMAILS = `${users.author.email},${users.other.email}`
    signInAs(users.other.id)
    const response = await publishPost(new Request("http://localhost", { method: "PATCH" }), slugParams("draft-post"))

    expect(response.status).toBe(404)
    expect(fake.calls["post.update"]).toBeUndefined()
  })

  it("an anonymous publish attempt gets 401", async () => {
    const response = await publishPost(new Request("http://localhost", { method: "PATCH" }), slugParams("draft-post"))
    expect(response.status).toBe(401)
  })

  it("the drafts list is scoped to the caller", async () => {
    signInAs(users.other.id)
    const response = await listDrafts()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual([])
    const args = fake.calls["post.findMany"][0] as { where: { authorId: string; published: boolean } }
    expect(args.where).toEqual({ authorId: users.other.id, published: false })
  })

  it("a non-owner still cannot edit someone else's comment", async () => {
    signInAs(users.other.id)
    const response = await updateComment(
      jsonRequest("http://localhost", "PUT", { content: "Hijack" }),
      { params: { slug: "published-post", commentId: "c_p_published" } },
    )
    expect(response.status).toBe(403)
  })
})
