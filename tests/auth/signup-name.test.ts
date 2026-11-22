import { beforeEach, describe, expect, it, vi } from "vitest"

const db = vi.hoisted(() => ({
  created: [] as Array<{ data: { email: string; name: string | null } }>,
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(async () => null),
      create: vi.fn(async (args: { data: { email: string; name: string | null } }) => {
        db.created.push(args)
        return { id: "u_new", image: null, ...args.data }
      }),
    },
  },
}))

import { authOptions } from "@/lib/auth"

type Authorize = (credentials: Record<string, string>, req: unknown) => Promise<{ name?: string | null } | null>

// next-auth v4 keeps the user-supplied authorize on provider.options.
const provider = authOptions.providers[0] as unknown as { options: { authorize: Authorize } }
const authorize = provider.options.authorize

function signUp(name: string | undefined) {
  return authorize(
    {
      email: "new.person@example.com",
      password: "a-long-test-password",
      isSignup: "true",
      ...(name === undefined ? {} : { name }),
    },
    {},
  )
}

beforeEach(() => {
  db.created.length = 0
})

describe("sign-up display name", () => {
  it("stores null (shown as Anonymous) when no name is given, never the email prefix", async () => {
    const user = await signUp(undefined)

    expect(db.created[0].data.name).toBeNull()
    expect(user?.name).toBeNull()
  })

  it("stores null for an empty or whitespace-only name", async () => {
    await signUp("")
    await signUp("   ")

    expect(db.created.map((call) => call.data.name)).toEqual([null, null])
  })

  it("keeps a provided name, trimmed", async () => {
    await signUp("  Asha  ")

    expect(db.created[0].data.name).toBe("Asha")
  })

  it("never stores any part of the email as the name", async () => {
    await signUp(undefined)

    expect(db.created[0].data.name ?? "").not.toContain("new.person")
  })
})
