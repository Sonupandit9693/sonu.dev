// In-memory stand-in for the rate-limit Lua script, with a controllable clock.
// Mirrors the script's semantics: INCR, set the expiry on the first hit (or when
// the key has no expiry), and drop keys whose window has passed.

export function createFakeRateLimitStore() {
  let now = 0
  const data = new Map<string, { count: number; expiresAt: number | null }>()
  const calls: Array<{ keys: string[]; args: string[] }> = []

  return {
    data,
    calls,
    advance(ms: number) {
      now += ms
    },
    async eval(_script: string, keys: string[], args: string[]) {
      calls.push({ keys, args })
      const key = keys[0]
      let entry = data.get(key)
      if (entry && entry.expiresAt !== null && entry.expiresAt <= now) {
        data.delete(key)
        entry = undefined
      }
      const count = (entry?.count ?? 0) + 1
      const expiresAt = !entry || entry.expiresAt === null ? now + Number(args[0]) : entry.expiresAt
      data.set(key, { count, expiresAt })
      return count
    },
  }
}

export type FakeRateLimitStore = ReturnType<typeof createFakeRateLimitStore>
