// Runs before every test file (vitest setupFiles). Tests must never reach a
// remote service.
//
// 1. Pin every service variable to a LOCAL value before any app module loads.
//    Importing @prisma/client loads .env into process.env, but it never
//    overrides variables that are already set, so these values win.
//    The Redis URL points at a closed local port, so code that is not given a
//    fake store always fails open instead of counting anywhere.
// 2. Refuse any fetch to a non-local host (the Upstash client uses fetch).
import { classifyUrl } from "../../scripts/assert-local-env.mjs"

process.env.DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:55432/sonudev_test"
process.env.UPSTASH_REDIS_REST_URL = "http://127.0.0.1:9"
process.env.UPSTASH_REDIS_REST_TOKEN = "test-token-not-real"
// No admins unless a test sets them, so the real .env value never leaks in.
process.env.ADMIN_EMAILS = ""

const realFetch = globalThis.fetch

function requestUrl(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === "string") return input
  if (input instanceof URL) return input.href
  return input.url
}

globalThis.fetch = (async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
  const url = requestUrl(input)
  if (!classifyUrl(url).ok) {
    throw new Error("Blocked a non-local network request during tests")
  }
  return realFetch(input, init)
}) as typeof fetch
