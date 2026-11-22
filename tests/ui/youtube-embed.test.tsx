import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import YouTubeEmbed from "@/app/blogs/components/YouTubeEmbed"

const ID = "dQw4w9WgXcQ"

function attributesOf(html: string) {
  const tag = html.match(/<iframe[^>]*>/)?.[0] ?? ""
  return Object.fromEntries(
    Array.from(tag.matchAll(/([a-zA-Z-]+)(?:="([^"]*)")?/g))
      .slice(1)
      // HTML attribute names are case-insensitive; React keeps some camelCase.
      .map(([, name, value]) => [name.toLowerCase(), value ?? ""]),
  )
}

describe("YouTubeEmbed", () => {
  it("renders a sandboxed iframe with a src rebuilt from the video ID", () => {
    const html = renderToStaticMarkup(<YouTubeEmbed url={`https://www.youtube.com/watch?v=${ID}&t=5s`} />)
    const attrs = attributesOf(html)

    expect(attrs.src).toBe(`https://www.youtube-nocookie.com/embed/${ID}`)
    expect(attrs.sandbox).toBe("allow-scripts allow-same-origin")
    expect(attrs.allow).toBe("encrypted-media; picture-in-picture; fullscreen")
    expect(attrs).toHaveProperty("allowfullscreen")
    expect(attrs.referrerpolicy).toBe("strict-origin-when-cross-origin")
    expect(attrs.loading).toBe("lazy")
  })

  it("grants no sandbox tokens beyond the minimum", () => {
    const html = renderToStaticMarkup(<YouTubeEmbed url={`https://youtu.be/${ID}`} />)
    const tokens = attributesOf(html).sandbox.split(" ").sort()

    expect(tokens).toEqual(["allow-same-origin", "allow-scripts"])
    expect(html).not.toMatch(/allow-popups|allow-top-navigation|allow-forms|allow-presentation/)
  })

  it.each([
    "javascript:alert(document.domain)",
    "https://evil.example/phishing",
    "http://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "data:text/html,<h1>x</h1>",
    "",
    null,
    undefined,
  ])("renders nothing for unsupported or legacy stored value %j", (url) => {
    expect(renderToStaticMarkup(<YouTubeEmbed url={url} />)).toBe("")
  })

  it("never copies the stored string into the markup", () => {
    const stored = `https://www.youtube.com/watch?v=${ID}&marker=STORED_STRING_MARKER`
    const html = renderToStaticMarkup(<YouTubeEmbed url={stored} />)

    expect(html).not.toContain("STORED_STRING_MARKER")
  })
})
