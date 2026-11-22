// Runs the real Lua script against the LOCAL serverless-redis-http container.
// Skipped unless RUN_INTEGRATION=1 (see `pnpm test:integration`). Never reads
// .env: the local URL and throwaway token are fixed here and checked by the
// same guard used for local setup before any request is sent.
import { Redis } from "@upstash/redis"
import { beforeAll, describe, expect, it } from "vitest"
import { checkRateLimit, rateLimitKey, type RateLimitRule } from "@/lib/rate-limit"
import { classifyUrl } from "../../scripts/assert-local-env.mjs"

const LOCAL_URL = "http://127.0.0.1:8079"
const LOCAL_TOKEN = "local-test-token"
const enabled = process.env.RUN_INTEGRATION === "1"

describe.skipIf(!enabled)("rate limiter against local Redis (real Lua)", () => {
  let redis: Redis
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`

  beforeAll(async () => {
    if (!classifyUrl(LOCAL_URL).ok) throw new Error("Refusing to run: Redis URL is not local")
    redis = new Redis({ url: LOCAL_URL, token: LOCAL_TOKEN })
    expect(await redis.ping()).toBe("PONG")
  })

  it("is atomic under concurrency: 50 parallel hits yield exactly `limit` allowed", async () => {
    const rule: RateLimitRule = { scope: `it:concurrency:${runId}`, limit: 7, windowMs: 60_000 }
    const results = await Promise.all(Array.from({ length: 50 }, () => checkRateLimit(rule, "same-client", redis)))

    expect(results.filter((r) => r.allowed)).toHaveLength(7)
    expect(results.every((r) => !r.failedOpen)).toBe(true)
    expect(Number(await redis.get(rateLimitKey(rule, "same-client")))).toBe(50)
  })

  it("sets the expiry on the first hit and does not extend it on later hits", async () => {
    const rule: RateLimitRule = { scope: `it:ttl:${runId}`, limit: 5, windowMs: 30_000 }
    const key = rateLimitKey(rule, "ttl-client")

    await checkRateLimit(rule, "ttl-client", redis)
    const first = await redis.pttl(key)
    await new Promise((resolve) => setTimeout(resolve, 300))
    await checkRateLimit(rule, "ttl-client", redis)
    const second = await redis.pttl(key)

    expect(first).toBeGreaterThan(29_000)
    expect(first).toBeLessThanOrEqual(30_000)
    expect(second).toBeLessThan(first)
  })

  it("repairs a counter that has no expiry", async () => {
    const rule: RateLimitRule = { scope: `it:repair:${runId}`, limit: 5, windowMs: 20_000 }
    const key = rateLimitKey(rule, "repair-client")
    await redis.set(key, 3)
    expect(await redis.pttl(key)).toBe(-1)

    await checkRateLimit(rule, "repair-client", redis)

    expect(Number(await redis.get(key))).toBe(4)
    expect(await redis.pttl(key)).toBeGreaterThan(0)
  })

  it("expires and resets after the window", async () => {
    const rule: RateLimitRule = { scope: `it:expiry:${runId}`, limit: 1, windowMs: 400 }

    expect((await checkRateLimit(rule, "short-window", redis)).allowed).toBe(true)
    expect((await checkRateLimit(rule, "short-window", redis)).allowed).toBe(false)
    await new Promise((resolve) => setTimeout(resolve, 600))
    expect((await checkRateLimit(rule, "short-window", redis)).allowed).toBe(true)
  })
})
