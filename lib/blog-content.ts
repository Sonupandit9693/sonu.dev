export function validatePostContent(content: string, requireBody: boolean) {
  const trimmedContent = content.trim()

  if (!trimmedContent.startsWith("{")) {
    return requireBody && !trimmedContent
      ? "Published posts must include content"
      : null
  }

  let document: unknown
  try {
    document = JSON.parse(trimmedContent)
  } catch {
    return "Post content is not valid JSON"
  }

  if (
    typeof document !== "object" ||
    document === null ||
    !("type" in document) ||
    document.type !== "doc" ||
    !("content" in document) ||
    !Array.isArray(document.content)
  ) {
    return "Post content must be a valid editor document"
  }

  let hasBody = false
  const nodes: unknown[] = [document]
  while (nodes.length > 0) {
    const node = nodes.pop()
    if (!node || typeof node !== "object") continue

    if ("text" in node && typeof node.text === "string" && node.text.trim()) {
      hasBody = true
    }

    if ("type" in node && node.type === "image" && "attrs" in node) {
      const attrs = node.attrs
      if (typeof attrs === "object" && attrs !== null && "src" in attrs && typeof attrs.src === "string") {
        if (attrs.src.startsWith("data:image/")) {
          return "Images must be uploaded before the post can be saved"
        }
        if (attrs.src) hasBody = true
      }
    }

    if ("content" in node && Array.isArray(node.content)) {
      for (const child of node.content) nodes.push(child)
    }
  }

  return requireBody && !hasBody ? "Published posts must include content" : null
}
