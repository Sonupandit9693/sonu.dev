// Admin allowlist, configured server-side with ADMIN_EMAILS (comma-separated).
// Missing or empty ADMIN_EMAILS means there are no admins (fails safe).
// Comparison is case-insensitive and ignores surrounding whitespace.

export function parseAdminEmails(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )
}

export function isAdminEmail(
  email: string | null | undefined,
  raw: string | undefined = process.env.ADMIN_EMAILS,
): boolean {
  if (!email) return false
  return parseAdminEmails(raw).has(email.trim().toLowerCase())
}
