import { afterEach, describe, expect, it, vi } from "vitest"
import {
  checkRateLimit,
  clientIpBucket,
  rateLimitKey,
  UNTRUSTED_IP_BUCKET,
  type RateLimitRule,
} from "@/lib/rate-limit"
import { createFakeRateLimitStore } from "../helpers/fake-rate-limit-store"

const rule: RateLimitRule = { scope: "test:scope", limit: 3, windowMs: 60_000 }

afterEach(() => {
  vi.restoreAllMocks()
})

describe("checkRateLimit", () => {
  it("allows up to the limit and blocks after it", async () => {
    const store = createFakeRateLimitStore()
    const results = []
    for (let i = 0; i < 5; i++) results.push((await checkRateLimit(rule, "client-a", store)).allowed)

    expect(results).toEqual([true, true, true, false, false])
  })

  it("resets after the window expires", async () => {
    const store = createFakeRateLimitStore()
    for (let i = 0; i < 4; i++) await checkRateLimit(rule, "client-a", store)
    expect((await checkRateLimit(rule, "client-a", store)).allowed).toBe(false)

    store.advance(60_000)
    expect((await checkRateLimit(rule, "client-a", store)).allowed).toBe(true)
  })

  it("does not extend the window on later hits (fixed window)", async () => {
    const store = createFakeRateLimitStore()
    await checkRateLimit(rule, "client-a", store)
    store.advance(59_000)
    await checkRateLimit(rule, "client-a", store)
    await checkRateLimit(rule, "client-a", store)
    expect((await checkRateLimit(rule, "client-a", store)).allowed).toBe(false)

    store.advance(1_000)
    expect((await checkRateLimit(rule, "client-a", store)).allowed).toBe(true)
  })

  it("keeps separate counters per identifier and per scope", async () => {
    const store = createFakeRateLimitStore()
    for (let i = 0; i < 3; i++) await checkRateLimit(rule, "client-a", store)

    expect((await checkRateLimit(rule, "client-b", store)).allowed).toBe(true)
    expect((await checkRateLimit({ ...rule, scope: "other:scope" }, "client-a", store)).allowed).toBe(true)
  })

  it("passes the window in milliseconds and a single key to the script", async () => {
    const store = createFakeRateLimitStore()
    await checkRateLimit(rule, "client-a", store)

    expect(store.calls[0].keys).toHaveLength(1)
    expect(store.calls[0].args).toEqual(["60000"])
  })

  it("never stores raw identifiers in keys", () => {
    const key = rateLimitKey(rule, "Person@Example.com")

    expect(key).toMatch(/^rl:test:scope:[0-9a-f]{64}$/)
    expect(key.toLowerCase()).not.toContain("person")
    expect(rateLimitKey(rule, "person@example.com ")).toBe(key)
  })
})

describe("checkRateLimit fails open with safe logging", () => {
  it("allows the request and logs only scope and error name when Redis errors", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const secretLikeMessage = "connect failed https://secret-db.upstash.io token=AbCdSecretToken123 for 203.0.113.7 user@example.com"
    const store = {
      eval: vi.fn(async () => {
        const error = new Error(secretLikeMessage)
        error.name = "UpstashError"
        throw error
      }),
    }

    const result = await checkRateLimit(rule, "user@example.com", store)

    expect(result).toEqual({ allowed: true, failedOpen: true })
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0]).toEqual(["[rate-limit] unavailable", { scope: "test:scope", errorName: "UpstashError" }])
    const logged = JSON.stringify(warn.mock.calls)
    for (const secret of ["secret-db", "AbCdSecretToken123", "203.0.113.7", "user@example.com", "upstash.io"]) {
      expect(logged).not.toContain(secret)
    }
  })

  it("fails open when no store is configured", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    expect(await checkRateLimit(rule, "client-a", null)).toEqual({ allowed: true, failedOpen: true })
    expect(warn.mock.calls[0][1]).toEqual({ scope: "test:scope", errorName: "RateLimitStoreNotConfigured" })
  })

  it("fails open on a non-numeric reply", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})

    expect(await checkRateLimit(rule, "client-a", { eval: async () => "not-a-number" })).toEqual({ allowed: true, failedOpen: true })
  })
})

describe("clientIpBucket", () => {
  it("on Vercel uses x-real-ip, then the first x-forwarded-for entry", () => {
    const env = { VERCEL: "1" } as NodeJS.ProcessEnv

    expect(clientIpBucket({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "198.51.100.1" }, env)).toBe("203.0.113.7")
    expect(clientIpBucket({ "x-forwarded-for": "198.51.100.1, 10.0.0.1" }, env)).toBe("198.51.100.1")
    expect(clientIpBucket(new Headers({ "x-forwarded-for": "198.51.100.2" }), env)).toBe("198.51.100.2")
    expect(clientIpBucket({}, env)).toBe(UNTRUSTED_IP_BUCKET)
  })

  it("outside Vercel ignores client-controlled headers and uses one shared bucket", () => {
    const env = {} as NodeJS.ProcessEnv

    expect(clientIpBucket({ "x-real-ip": "203.0.113.7" }, env)).toBe(UNTRUSTED_IP_BUCKET)
    expect(clientIpBucket({ "x-forwarded-for": "198.51.100.1" }, env)).toBe(UNTRUSTED_IP_BUCKET)
    expect(clientIpBucket(undefined, env)).toBe(UNTRUSTED_IP_BUCKET)
  })
})
