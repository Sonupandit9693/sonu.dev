import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { isAdminEmail } from "@/lib/admin"
import { authOptions } from "@/lib/auth"

type AdminCheck =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse }

// Server-side admin authorization for route handlers. Admin status is
// recomputed from the session email and ADMIN_EMAILS on every request; it never
// trusts a client-supplied flag (session.user.isAdmin is for UI visibility only).
export async function requireAdmin(): Promise<AdminCheck> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  if (!isAdminEmail(session.user.email)) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return { ok: true, userId: session.user.id }
}
