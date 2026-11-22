// Shared input validation for user-supplied text.

export const COMMENT_MAX_LENGTH = 2000
export const NAME_MAX_LENGTH = 50
export const PASSWORD_MIN_LENGTH = 12
export const EMAIL_MAX_LENGTH = 254

type Parsed<T> = { ok: true; value: T } | { ok: false; error: string }

export function parseCommentContent(value: unknown): Parsed<string> {
  if (typeof value !== "string") return { ok: false, error: "Comment content is required" }
  const content = value.trim()
  if (!content) return { ok: false, error: "Comment content is required" }
  if (content.length > COMMENT_MAX_LENGTH) {
    return { ok: false, error: `Comments must be ${COMMENT_MAX_LENGTH} characters or fewer` }
  }
  return { ok: true, value: content }
}

// Blank names are allowed and stored as null (shown as "Anonymous").
export function parseDisplayName(value: unknown): Parsed<string | null> {
  if (value === undefined || value === null) return { ok: true, value: null }
  if (typeof value !== "string") return { ok: false, error: "Name is invalid" }
  const name = value.trim()
  if (!name) return { ok: true, value: null }
  if (name.length > NAME_MAX_LENGTH) {
    return { ok: false, error: `Name must be ${NAME_MAX_LENGTH} characters or fewer` }
  }
  return { ok: true, value: name }
}

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null
  const email = value.trim().toLowerCase()
  if (!email || email.length > EMAIL_MAX_LENGTH || !/^[^\s@]+@[^\s@]+$/.test(email)) return null
  return email
}

// Request bodies that are not valid JSON objects become null instead of throwing.
export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json()
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null
  } catch {
    return null
  }
}
