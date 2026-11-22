import { beforeEach, describe, expect, it, vi } from "vitest"
import { createFakePrisma, users } from "../helpers/fake-prisma"

const state = vi.hoisted(() => ({
  prisma: null as unknown,
  session: null as { user: { id: string; email: string } } | null,
}))

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return state.prisma
  },
}))
vi.mock("next-auth", () => ({ getServerSession: vi.fn(async () => state.session) }))

import { POST as createPost } from "@/app/api/posts/route"

let fake: ReturnType<typeof createFakePrisma>

beforeEach(() => {
  fake = createFakePrisma()
  state.prisma = fake
  process.env.ADMIN_EMAILS = users.author.email
  state.session = { user: { id: users.author.id, email: users.author.email } }
})

function create(videoUrl: unknown) {
  return createPost(new Request("http://localhost/api/posts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "Video post", content: "Hello world", slug: "video-post", published: true, videoUrl }),
  }))
}

function storedVideoUrl() {
  const args = fake.calls["post.create"]?.[0] as { data: { videoUrl: string | null } } | undefined
  return args?.data.videoUrl
}

describe("POST /api/posts videoUrl", () => {
  it.each([
    "javascript:alert(document.domain)",
    "https://evil.example/phishing",
    "http://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ",
  ])("rejects %s with 400 and stores nothing", async (videoUrl) => {
    const response = await create(videoUrl)

    expect(response.status).toBe(400)
    expect((await response.json()).error).toMatch(/YouTube/)
    expect(fake.calls["post.create"]).toBeUndefined()
  })

  it.each([
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"],
    ["https://youtu.be/dQw4w9WgXcQ", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"],
    ["https://www.youtube.com/shorts/dQw4w9WgXcQ", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"],
  ])("accepts %s and stores the normalized embed URL", async (videoUrl, expected) => {
    const response = await create(videoUrl)

    expect(response.status).toBe(201)
    expect(storedVideoUrl()).toBe(expected)
  })

  it.each([null, undefined, "", "   "])("treats %j as no video", async (videoUrl) => {
    const response = await create(videoUrl)

    expect(response.status).toBe(201)
    expect(storedVideoUrl()).toBeNull()
  })

  it("still rejects a non-string videoUrl with the general validation error", async () => {
    const response = await create(42)

    expect(response.status).toBe(400)
    expect(fake.calls["post.create"]).toBeUndefined()
  })
})
