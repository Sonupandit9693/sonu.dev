import { createHash } from "node:crypto"
import { Redis } from "@upstash/redis"

// Fixed-window rate limiting on Upstash Redis.
//
// Atomicity: INCR and PEXPIRE run inside one Lua script, which Redis executes
// atomically, so concurrent requests can never skip the expiry or double-count.
// The PTTL == -1 branch repairs a key that somehow lost its expiry, so a
// counter can never become permanent.
//
// Failure policy: FAIL OPEN. If Redis is unreachable or not configured, the
// request is allowed and a warning is logged with only the scope and the error
// name (never the error message, URL, token, IP or email).
//
// Client IP: on Vercel (VERCEL=1) the client IP comes from x-real-ip / the first
// x-forwarded-for entry, which Vercel overwrites to prevent spoofing. Anywhere
// else (local dev, self-hosting, or a proxy in front of Vercel) those headers are
// client-controlled, so ALL per-IP limits share ONE "untrusted" bucket: a burst
// from one client can slow sign-in/sign-up for everyone on that deployment.
// Per-email limits are unaffected and still apply per account.

const INCREMENT_WITH_EXPIRY = `
local count = redis.call('INCR', KEYS[1])
if count == 1 or redis.call('PTTL', KEYS[1]) == -1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
return count
`

export interface RateLimitRule {
  scope: string
  limit: number
  windowMs: number
}

export const RATE_LIMITS = {
  signInPerIp: { scope: "signin:ip", limit: 10, windowMs: 15 * 60 * 1000 },
  signInPerEmail: { scope: "signin:email", limit: 5, windowMs: 15 * 60 * 1000 },
  // 10/hour: many mobile users share one public IP through carrier-grade NAT.
  // Rejected attempts (e.g. a too-short password) count too, to limit abuse.
  signUpPerIp: { scope: "signup:ip", limit: 10, windowMs: 60 * 60 * 1000 },
  commentPerUser: { scope: "comment:user", limit: 10, windowMs: 5 * 60 * 1000 },
} satisfies Record<string, RateLimitRule>

export interface RateLimitResult {
  allowed: boolean
  failedOpen: boolean
}

// Minimal surface used here, so tests can pass a fake or a local client.
export interface RateLimitStore {
  eval(script: string, keys: string[], args: string[]): Promise<unknown>
}

export const UNTRUSTED_IP_BUCKET = "untrusted"

let defaultStore: RateLimitStore | null | undefined

function getDefaultStore(): RateLimitStore | null {
  if (defaultStore !== undefined) return defaultStore
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  // Few retries so a Redis outage does not stall sign-in.
  defaultStore = url && token
    ? new Redis({ url, token, retry: { retries: 1, backoff: () => 100 } })
    : null
  return defaultStore
}

export function rateLimitKey(rule: RateLimitRule, identifier: string): string {
  // Identifiers (IPs, emails, user IDs) are hashed and never stored raw.
  const digest = createHash("sha256").update(identifier.trim().toLowerCase()).digest("hex")
  return `rl:${rule.scope}:${digest}`
}

export async function checkRateLimit(
  rule: RateLimitRule,
  identifier: string,
  store: RateLimitStore | null = getDefaultStore(),
): Promise<RateLimitResult> {
  try {
    if (!store) {
      const error = new Error("Rate limit store is not configured")
      error.name = "RateLimitStoreNotConfigured"
      throw error
    }
    const count = Number(await store.eval(INCREMENT_WITH_EXPIRY, [rateLimitKey(rule, identifier)], [String(rule.windowMs)]))
    if (!Number.isFinite(count)) throw new TypeError("Unexpected rate limit counter value")
    return { allowed: count <= rule.limit, failedOpen: false }
  } catch (error) {
    console.warn("[rate-limit] unavailable", {
      scope: rule.scope,
      errorName: error instanceof Error ? error.name : "UnknownError",
    })
    return { allowed: true, failedOpen: true }
  }
}

type HeaderSource = Headers | Record<string, unknown> | undefined

function readHeader(headers: HeaderSource, name: string): string | undefined {
  if (!headers) return undefined
  if (typeof (headers as Headers).get === "function") return (headers as Headers).get(name) ?? undefined
  const record = headers as Record<string, unknown>
  const value = record[name] ?? record[name.toLowerCase()]
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : undefined
  return typeof value === "string" ? value : undefined
}

export function clientIpBucket(headers: HeaderSource, env: NodeJS.ProcessEnv = process.env): string {
  if (env.VERCEL !== "1") return UNTRUSTED_IP_BUCKET
  const ip = readHeader(headers, "x-real-ip")?.trim() || readHeader(headers, "x-forwarded-for")?.split(",")[0]?.trim()
  return ip || UNTRUSTED_IP_BUCKET
}
