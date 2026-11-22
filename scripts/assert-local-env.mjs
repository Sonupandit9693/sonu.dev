#!/usr/bin/env node
// Local-only safety guard for tests, schema setup, builds and local servers.
// Refuses to continue unless every data-service URL in the process environment
// points at this machine. It prints only a classification, never the URL.
//
// Usage: node scripts/assert-local-env.mjs   (exit 0 = all local, 1 = refused)

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"])

// Every external data store the app can reach.
export const CHECKED_VARIABLES = ["DATABASE_URL", "UPSTASH_REDIS_REST_URL"]

export function classifyUrl(value) {
  if (!value || !value.trim()) return { ok: false, reason: "missing" }

  let url
  try {
    url = new URL(value.trim())
  } catch {
    return { ok: false, reason: "unparseable" }
  }

  const host = url.hostname.toLowerCase()
  if (!host) return { ok: false, reason: "no host" }
  return LOCAL_HOSTS.has(host) ? { ok: true, reason: "local" } : { ok: false, reason: "remote host" }
}

export function checkEnv(env) {
  return CHECKED_VARIABLES.map((name) => ({ name, ...classifyUrl(env[name]) }))
}

const isCli = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href
if (isCli) {
  const results = checkEnv(process.env)
  for (const { name, ok, reason } of results) {
    console.log(`${name}: ${ok ? "OK (local)" : `REFUSED (${reason})`}`)
  }
  if (results.some((result) => !result.ok)) {
    console.error("Local environment guard failed: refusing to continue.")
    process.exit(1)
  }
  console.log("Local environment guard passed.")
}
