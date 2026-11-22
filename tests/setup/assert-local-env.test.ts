import { describe, expect, it } from "vitest"
import { checkEnv, classifyUrl } from "../../scripts/assert-local-env.mjs"

describe("local environment guard", () => {
  it.each([
    "postgresql://postgres:postgres@127.0.0.1:55432/sonudev_test",
    "postgresql://postgres:postgres@localhost:5432/db",
    "postgresql://postgres:postgres@[::1]:5432/db",
    "http://127.0.0.1:8079",
    "http://LOCALHOST:8079",
  ])("accepts local %s", (url) => {
    expect(classifyUrl(url)).toEqual({ ok: true, reason: "local" })
  })

  it.each([
    "postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require",
    "https://example-db.upstash.io",
    "postgresql://user:pass@localhost.evil.com:5432/db",
    "postgresql://user:pass@127.0.0.1.nip.io:5432/db",
    "postgresql://user:pass@0.0.0.0:5432/db",
    "postgresql://user:pass@postgres:5432/db",
    "postgresql://user:pass@192.168.1.10:5432/db",
  ])("refuses remote or ambiguous %s", (url) => {
    expect(classifyUrl(url)).toEqual({ ok: false, reason: "remote host" })
  })

  it.each([
    [undefined, "missing"],
    ["", "missing"],
    ["   ", "missing"],
    ["not a url", "unparseable"],
  ])("refuses %j (%s)", (url, reason) => {
    expect(classifyUrl(url)).toEqual({ ok: false, reason })
  })

  it("requires every data service to be local, not just one", () => {
    const results = checkEnv({
      DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:55432/sonudev_test",
      UPSTASH_REDIS_REST_URL: "https://example-db.upstash.io",
    })

    expect(results.map((result) => result.ok)).toEqual([true, false])
  })
})
