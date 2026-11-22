import bcrypt from "bcryptjs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createFakeRateLimitStore, type FakeRateLimitStore } from "../helpers/fake-rate-limit-store"

const state = vi.hoisted(() => {
  // The rate limiter reads these when it first creates its client; the client
  // itself is mocked below, so nothing is contacted.
  process.env.UPSTASH_REDIS_REST_URL = "http://127.0.0.1:1"
  process.env.UPSTASH_REDIS_REST_TOKEN = "unused-test-token"
  return {
    store: null as unknown as { eval: (...args: [string, string[], string[]]) => Promise<unknown> },
    users: new Map<string, { id: string; email: string; password: string; name: string | null; image: null }>(),
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
  prisma: {
    user: {
      findUnique: vi.fn(async ({ where }: { where: { email: string } }) => state.users.get(where.email) ?? null),
      create: vi.fn(async ({ data }: { data: { email: string; password: string; name: string | null } }) => {
        const user = { id: `u_${state.users.size + 1}`, image: null, ...data }
        state.users.set(data.email, user)
        return user
      }),
    },
  },
}))

import { authOptions, INVALID_SIGN_IN, SIGN_UP_FAILED, TOO_MANY_ATTEMPTS } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Authorize = (credentials: Record<string, string>, req: { headers?: Record<string, string> }) => Promise<unknown>
const authorize = (authOptions.providers[0] as unknown as { options: { authorize: Authorize } }).options.authorize

const PASSWORD = "correct-horse-battery"
let store: FakeRateLimitStore

async function attempt(credentials: Record<string, string>, headers: Record<string, string> = {}) {
  try {
    return { ok: true as const, user: await authorize(credentials, { headers }) }
  } catch (error) {
    return { ok: false as const, error: (error as Error).message }
  }
}

const signIn = (email: string, password: string, headers?: Record<string, string>) =>
  attempt({ email, password, isSignup: "false" }, headers)
const signUp = (fields: Record<string, string>, headers?: Record<string, string>) =>
  attempt({ password: "a-long-enough-password", isSignup: "true", ...fields }, headers)

beforeEach(async () => {
  store = createFakeRateLimitStore()
  state.store = store
  state.users.clear()
  state.users.set("member@example.com", {
    id: "u_member",
    email: "member@example.com",
    password: await bcrypt.hash(PASSWORD, 4),
    name: "Member",
    image: null,
  })
  vi.mocked(prisma.user.findUnique).mockClear()
  vi.mocked(prisma.user.create).mockClear()
  Reflect.deleteProperty(process.env, "VERCEL")
})

afterEach(() => {
  vi.restoreAllMocks()
  Reflect.deleteProperty(process.env, "VERCEL")
})

describe("sign-in: generic errors", () => {
  it("returns the same message for an unknown email and a wrong password", async () => {
    const unknown = await signIn("nobody@example.com", PASSWORD)
    const wrong = await signIn("member@example.com", "wrong-password")

    expect(unknown).toEqual({ ok: false, error: INVALID_SIGN_IN })
    expect(wrong).toEqual({ ok: false, error: INVALID_SIGN_IN })
  })

  it("still runs a bcrypt comparison when the email is unknown", async () => {
    const compare = vi.spyOn(bcrypt, "compare")

    await signIn("nobody@example.com", PASSWORD)

    expect(compare).toHaveBeenCalledTimes(1)
  })

  it("signs in with correct credentials, matching the email case-insensitively", async () => {
    const result = await signIn("  Member@Example.COM ", PASSWORD)

    expect(result).toMatchObject({ ok: true, user: { id: "u_member", email: "member@example.com" } })
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "member@example.com" } })
  })

  it("rejects a malformed email or empty password with the generic message", async () => {
    expect(await signIn("not-an-email", PASSWORD)).toEqual({ ok: false, error: INVALID_SIGN_IN })
    expect(await signIn("member@example.com", "")).toEqual({ ok: false, error: INVALID_SIGN_IN })
  })
})

describe("sign-in: rate limiting", () => {
  it("blocks the 11th attempt from one IP on Vercel, without touching the database", async () => {
    process.env.VERCEL = "1"
    const ip = { "x-real-ip": "203.0.113.7" }
    for (let i = 0; i < 10; i++) await signIn(`user${i}@example.com`, "wrong-password", ip)
    vi.mocked(prisma.user.findUnique).mockClear()

    expect(await signIn("member@example.com", PASSWORD, ip)).toEqual({ ok: false, error: TOO_MANY_ATTEMPTS })
    expect(prisma.user.findUnique).not.toHaveBeenCalled()
    // A different IP is still allowed.
    expect((await signIn("member@example.com", PASSWORD, { "x-real-ip": "198.51.100.9" })).ok).toBe(true)
  })

  it("limits one account to 5 attempts even when every attempt uses a different IP", async () => {
    process.env.VERCEL = "1"
    for (let i = 0; i < 5; i++) await signIn("member@example.com", "wrong-password", { "x-real-ip": `203.0.113.${i}` })

    expect(await signIn("member@example.com", PASSWORD, { "x-real-ip": "203.0.113.99" })).toEqual({ ok: false, error: TOO_MANY_ATTEMPTS })
  })

  it("counts the email limit case-insensitively", async () => {
    process.env.VERCEL = "1"
    for (let i = 0; i < 5; i++) await signIn(i % 2 ? "MEMBER@example.com" : "member@EXAMPLE.com", "wrong", { "x-real-ip": `203.0.113.${i}` })

    expect((await signIn("member@example.com", PASSWORD, { "x-real-ip": "203.0.113.50" })).ok).toBe(false)
  })

  it("outside Vercel, spoofed IP headers all land in one shared bucket", async () => {
    for (let i = 0; i < 10; i++) await signIn(`user${i}@example.com`, "wrong", { "x-forwarded-for": `198.51.100.${i}` })

    expect(await signIn("member@example.com", PASSWORD, { "x-forwarded-for": "198.51.100.200" })).toEqual({ ok: false, error: TOO_MANY_ATTEMPTS })
  })

  it("allows attempts again after the window", async () => {
    process.env.VERCEL = "1"
    for (let i = 0; i < 5; i++) await signIn("member@example.com", "wrong", { "x-real-ip": `203.0.113.${i}` })
    store.advance(15 * 60 * 1000)

    expect((await signIn("member@example.com", PASSWORD, { "x-real-ip": "203.0.113.1" })).ok).toBe(true)
  })

  it("fails open when Redis is down: sign-in still works and only safe fields are logged", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    state.store = {
      eval: async () => {
        const error = new Error("fetch failed for https://secret.upstash.io with token Zm9vYmFy")
        error.name = "TypeError"
        throw error
      },
    }

    expect((await signIn("member@example.com", PASSWORD)).ok).toBe(true)
    expect(warn).toHaveBeenCalled()
    const logged = JSON.stringify(warn.mock.calls)
    expect(logged).not.toMatch(/secret\.upstash\.io|Zm9vYmFy|member@example\.com/)
    for (const call of warn.mock.calls) expect(Object.keys(call[1] as object).sort()).toEqual(["errorName", "scope"])
  })
})

describe("sign-up: validation and limits", () => {
  it("stores a trimmed, lowercased email and a trimmed name", async () => {
    const result = await signUp({ email: "  New.User@Example.com ", name: "  Asha  " })

    expect(result.ok).toBe(true)
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ email: "new.user@example.com", name: "Asha" }),
    })
  })

  it("accepts a 50-character name and rejects 51 characters", async () => {
    expect((await signUp({ email: "fifty@example.com", name: "a".repeat(50) })).ok).toBe(true)
    expect(await signUp({ email: "fiftyone@example.com", name: "a".repeat(51) })).toEqual({
      ok: false,
      error: "Name must be 50 characters or fewer",
    })
  })

  it("measures the name limit after trimming", async () => {
    expect((await signUp({ email: "padded@example.com", name: `   ${"b".repeat(50)}   ` })).ok).toBe(true)
  })

  it("requires a password of at least 12 characters for new accounts", async () => {
    expect(await signUp({ email: "short@example.com", password: "elevenchars" })).toEqual({
      ok: false,
      error: "Password must be at least 12 characters",
    })
    expect((await signUp({ email: "twelve@example.com", password: "twelve-chars" })).ok).toBe(true)
  })

  it("does not apply the new password rule to existing accounts signing in", async () => {
    state.users.set("legacy@example.com", {
      id: "u_legacy",
      email: "legacy@example.com",
      password: await bcrypt.hash("short", 4),
      name: null,
      image: null,
    })

    expect((await signIn("legacy@example.com", "short")).ok).toBe(true)
  })

  it("rejects an existing email (any case) with a generic message", async () => {
    expect(await signUp({ email: "MEMBER@example.com" })).toEqual({ ok: false, error: SIGN_UP_FAILED })
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it("allows 10 sign-ups per IP per hour and blocks the 11th", async () => {
    process.env.VERCEL = "1"
    const ip = { "x-real-ip": "203.0.113.20" }
    for (let i = 0; i < 10; i++) expect((await signUp({ email: `s${i}@example.com` }, ip)).ok).toBe(true)

    expect(await signUp({ email: "s10@example.com" }, ip)).toEqual({ ok: false, error: TOO_MANY_ATTEMPTS })
    expect(prisma.user.create).toHaveBeenCalledTimes(10)
    // A different IP is unaffected.
    expect((await signUp({ email: "other-ip@example.com" }, { "x-real-ip": "198.51.100.30" })).ok).toBe(true)
  })

  it("counts rejected sign-up attempts toward the limit", async () => {
    process.env.VERCEL = "1"
    const ip = { "x-real-ip": "203.0.113.21" }
    for (let i = 0; i < 10; i++) await signUp({ email: `bad${i}@example.com`, password: "short" }, ip)

    expect(await signUp({ email: "good@example.com" }, ip)).toEqual({ ok: false, error: TOO_MANY_ATTEMPTS })
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it("allows sign-ups again after the hour", async () => {
    process.env.VERCEL = "1"
    const ip = { "x-real-ip": "203.0.113.22" }
    for (let i = 0; i < 10; i++) await signUp({ email: `w${i}@example.com` }, ip)
    store.advance(60 * 60 * 1000)

    expect((await signUp({ email: "after-window@example.com" }, ip)).ok).toBe(true)
  })
})
