import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createFakePrisma, users } from "../helpers/fake-prisma"

const state = vi.hoisted(() => ({
  prisma: null as unknown,
  session: null as { user: { id: string; email: string } } | null,
  s3Send: null as unknown as ReturnType<typeof vi.fn>,
}))

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return state.prisma
  },
}))
vi.mock("next-auth", () => ({ getServerSession: vi.fn(async () => state.session) }))
// S3 is never contacted: the client is replaced with a spy.
vi.mock("@/lib/s3", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/s3")>()
  return {
    ...actual,
    getS3Configuration: () => ({ bucket: "test-bucket", client: { send: state.s3Send } }),
  }
})

import { isAdminEmail, parseAdminEmails } from "@/lib/admin"
import { authOptions } from "@/lib/auth"
import { POST as createPost } from "@/app/api/posts/route"
import { PATCH as publishPost } from "@/app/api/posts/[slug]/route"
import { POST as uploadImage } from "@/app/api/upload/route"

type Caller = "anonymous" | "user" | "admin"

function signInAs(caller: Caller) {
  const user = caller === "admin" ? users.author : caller === "user" ? users.other : null
  state.session = user ? { user: { id: user.id, email: user.email } } : null
}

const newPost = () =>
  new Request("http://localhost/api/posts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "New", content: "Hello world", slug: "brand-new", published: true }),
  })

const publish = () =>
  publishPost(new Request("http://localhost", { method: "PATCH" }), { params: { slug: "draft-post" } })

const upload = () =>
  uploadImage(new Request("http://localhost/api/upload", {
    method: "POST",
    headers: { "content-type": "image/png" },
    body: new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
  }))

let fake: ReturnType<typeof createFakePrisma>

beforeEach(() => {
  fake = createFakePrisma()
  state.prisma = fake
  state.s3Send = vi.fn(async () => ({}))
  process.env.ADMIN_EMAILS = users.author.email
  signInAs("anonymous")
})

afterEach(() => {
  Reflect.deleteProperty(process.env, "ADMIN_EMAILS")
})

describe("ADMIN_EMAILS parsing", () => {
  it("is case-insensitive and ignores whitespace and empty entries", () => {
    expect(Array.from(parseAdminEmails(" Admin@Example.com , ,second@example.com "))).toEqual([
      "admin@example.com",
      "second@example.com",
    ])
    expect(isAdminEmail("ADMIN@example.COM", "admin@example.com")).toBe(true)
  })

  it("treats missing or empty configuration as no admins", () => {
    expect(isAdminEmail("admin@example.com", undefined)).toBe(false)
    expect(isAdminEmail("admin@example.com", "")).toBe(false)
    expect(isAdminEmail("admin@example.com", " , ")).toBe(false)
  })

  it("never matches a missing email or a partial address", () => {
    expect(isAdminEmail(null, "admin@example.com")).toBe(false)
    expect(isAdminEmail(undefined, "admin@example.com")).toBe(false)
    expect(isAdminEmail("admin@example.co", "admin@example.com")).toBe(false)
    expect(isAdminEmail("evil+admin@example.com", "admin@example.com")).toBe(false)
  })
})

describe("authorization matrix", () => {
  it.each<[Caller, number, number, number]>([
    ["anonymous", 401, 401, 401],
    ["user", 403, 403, 403],
    ["admin", 201, 200, 200],
  ])("%s: create %i, publish %i, upload %i", async (caller, createStatus, publishStatus, uploadStatus) => {
    signInAs(caller)

    expect((await createPost(newPost())).status).toBe(createStatus)
    expect((await publish()).status).toBe(publishStatus)
    expect((await upload()).status).toBe(uploadStatus)
  })

  it("rejected callers never reach the database write or S3", async () => {
    for (const caller of ["anonymous", "user"] as const) {
      signInAs(caller)
      await createPost(newPost())
      await publish()
      await upload()
    }

    expect(fake.calls["post.create"]).toBeUndefined()
    expect(fake.calls["post.update"]).toBeUndefined()
    expect(state.s3Send).not.toHaveBeenCalled()
  })

  it("an admin's upload reaches S3 exactly once", async () => {
    signInAs("admin")
    const response = await upload()

    expect(response.status).toBe(200)
    expect(state.s3Send).toHaveBeenCalledTimes(1)
    expect((await response.json()).url).toMatch(/^\/api\/files\/upload-[0-9a-f-]{36}$/)
  })

  it("an admin's email in a different case is still an admin", async () => {
    process.env.ADMIN_EMAILS = users.author.email.toUpperCase()
    signInAs("admin")

    expect((await createPost(newPost())).status).toBe(201)
  })

  it("with ADMIN_EMAILS unset, even the intended admin is rejected (fails safe)", async () => {
    Reflect.deleteProperty(process.env, "ADMIN_EMAILS")
    signInAs("admin")

    expect((await createPost(newPost())).status).toBe(403)
    expect((await publish()).status).toBe(403)
    expect((await upload()).status).toBe(403)
  })
})

describe("session.user.isAdmin (UI visibility only)", () => {
  const configuredCallback = authOptions.callbacks?.session
  if (!configuredCallback) throw new Error("authOptions.callbacks.session must be configured")
  const sessionCallback = configuredCallback as unknown as (args: {
    session: { user: { id?: string; email?: string | null; isAdmin?: boolean } }
    token: { id: string }
  }) => Promise<{ user: { isAdmin?: boolean } }>

  it("is true only for an allowlisted email", async () => {
    const admin = await sessionCallback({ session: { user: { email: users.author.email } }, token: { id: users.author.id } })
    const user = await sessionCallback({ session: { user: { email: users.other.email } }, token: { id: users.other.id } })

    expect(admin.user.isAdmin).toBe(true)
    expect(user.user.isAdmin).toBe(false)
  })

  it("is ignored by the API: a forged isAdmin flag on a non-admin session is still rejected", async () => {
    state.session = { user: { id: users.other.id, email: users.other.email, isAdmin: true } as never }

    expect((await createPost(newPost())).status).toBe(403)
    expect((await upload()).status).toBe(403)
  })
})
