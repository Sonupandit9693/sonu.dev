// YouTube-only video URL handling. A stored videoUrl never reaches the DOM:
// the embed src is always rebuilt from a validated 11-character video ID on a
// fixed host, so non-YouTube URLs and other schemes (javascript:, data:, http:)
// can never produce an iframe.

const MAX_URL_LENGTH = 2048
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/
const PATH_ID = /^\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})\/?$/
const SHORT_LINK_ID = /^\/([A-Za-z0-9_-]{11})\/?$/

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "www.youtube-nocookie.com",
])

export function parseYouTubeId(input: unknown): string | null {
  if (typeof input !== "string") return null
  const value = input.trim()
  if (!value || value.length > MAX_URL_LENGTH) return null

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }

  if (url.protocol !== "https:" || url.username || url.password || url.port) return null

  if (url.hostname === "youtu.be") {
    return url.pathname.match(SHORT_LINK_ID)?.[1] ?? null
  }

  if (!YOUTUBE_HOSTS.has(url.hostname)) return null

  if (url.pathname === "/watch") {
    const id = url.searchParams.get("v")
    return id && VIDEO_ID.test(id) ? id : null
  }

  return url.pathname.match(PATH_ID)?.[1] ?? null
}

export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`
}
