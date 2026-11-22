import { describe, expect, it } from "vitest"
import { parseYouTubeId, youTubeEmbedUrl } from "@/lib/video"

const ID = "dQw4w9WgXcQ"

describe("parseYouTubeId accepts real YouTube links", () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://www.youtube.com/watch?v=${ID}&t=42s&list=PL123`,
    `https://www.youtube.com/watch?feature=share&v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=abc123`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://WWW.YOUTUBE.COM/watch?v=${ID}`,
    `  https://youtu.be/${ID}  `,
    // Query strings and fragments are ignored; only the validated ID is used.
    `https://www.youtube.com/embed/${ID}?x=1#"><script>`,
  ])("%s", (url) => {
    expect(parseYouTubeId(url)).toBe(ID)
  })
})

describe("parseYouTubeId rejects everything else", () => {
  it.each([
    // dangerous or non-https schemes
    "javascript:alert(document.domain)",
    "JavaScript:alert(1)//https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "data:text/html,<script>alert(1)</script>",
    `http://www.youtube.com/watch?v=${ID}`,
    `//www.youtube.com/watch?v=${ID}`,
    // look-alike and foreign hosts
    `https://youtube.com.evil.com/watch?v=${ID}`,
    `https://evilyoutube.com/watch?v=${ID}`,
    `https://www.youtube.com.evil.com/embed/${ID}`,
    `https://evil.com/?u=https://www.youtube.com/watch?v=${ID}`,
    `https://evil.com/https://youtu.be/${ID}`,
    "https://vimeo.com/123456789",
    // credentials or explicit ports
    `https://user:pass@www.youtube.com/watch?v=${ID}`,
    `https://www.youtube.com@evil.com/watch?v=${ID}`,
    `https://www.youtube.com:8443/watch?v=${ID}`,
    // wrong paths or IDs
    "https://www.youtube.com/watch?v=short",
    `https://www.youtube.com/watch?v=${ID}X`,
    "https://www.youtube.com/watch?v=dQw4w9WgXc!",
    "https://www.youtube.com/watch",
    `https://www.youtube.com/embed/${ID}/extra`,
    "https://www.youtube.com/channel/UC1234567890",
    "https://youtu.be/",
    `https://youtu.be/${ID}/more`,
    // non-strings and junk
    "",
    "   ",
    "not a url",
    `https://youtu.be/${ID}${"a".repeat(2048)}`,
  ])("%s", (url) => {
    expect(parseYouTubeId(url)).toBeNull()
  })

  it.each([null, undefined, 123, {}, []])("non-string %j", (value) => {
    expect(parseYouTubeId(value)).toBeNull()
  })
})

describe("youTubeEmbedUrl", () => {
  it("always uses the fixed privacy-enhanced host", () => {
    expect(youTubeEmbedUrl(ID)).toBe(`https://www.youtube-nocookie.com/embed/${ID}`)
  })
})
