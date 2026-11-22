"use client"

import RichTextEditor from "@/app/blogs/components/RichTextEditor"
import type { EditorDocument } from "@/app/blogs/components/RichTextEditor"

interface BlogPostContentProps {
  content: string
}

function isEditorDocument(value: unknown): value is EditorDocument {
  return typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "doc"
}

function withStableKeys(values: string[]) {
  const occurrences = new Map<string, number>()
  return values.map((value) => {
    const occurrence = occurrences.get(value) ?? 0
    occurrences.set(value, occurrence + 1)
    return { value, key: `${value}:${occurrence}` }
  })
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  if (content.trimStart().startsWith("{")) {
    try {
      const document = JSON.parse(content)
      if (isEditorDocument(document)) {
        return <RichTextEditor value={document} editable={false} />
      }
    } catch {
      return <p role="alert" className="text-red-400">This post content could not be displayed.</p>
    }
  }

  return (
    <div className="space-y-5 text-zinc-300">
      {withStableKeys(content.split("\n\n")).map(({ value: block, key }) => {
        if (block.startsWith("```")) {
          const [, language = "", ...lines] = block.split("\n")
          const code = lines.join("\n").replace(/```$/, "")
          return (
            <pre key={key} className="overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-950 p-5">
              {language && <span className="mb-2 block text-xs text-zinc-500">{language}</span>}
              <code>{code}</code>
            </pre>
          )
        }

        if (block.startsWith("### ")) return <h3 key={key} className="text-2xl font-bold text-white">{block.slice(4)}</h3>
        if (block.startsWith("## ")) return <h2 key={key} className="text-3xl font-bold text-white">{block.slice(3)}</h2>
        if (block.startsWith("# ")) return <h1 key={key} className="text-4xl font-bold text-white">{block.slice(2)}</h1>
        if (block.startsWith("> ")) {
          return <blockquote key={key} className="border-l-4 border-zinc-600 pl-5 italic text-zinc-400">{block.replace(/^> /gm, "")}</blockquote>
        }

        const lines = block.split("\n")
        if (lines.every((line) => line.startsWith("- "))) {
          return <ul key={key} className="list-disc space-y-2 pl-6">{withStableKeys(lines).map(({ value: line, key: itemKey }) => <li key={itemKey}>{line.slice(2)}</li>)}</ul>
        }
        if (lines.every((line) => /^\d+\. /.test(line))) {
          return <ol key={key} className="list-decimal space-y-2 pl-6">{withStableKeys(lines).map(({ value: line, key: itemKey }) => <li key={itemKey}>{line.replace(/^\d+\. /, "")}</li>)}</ol>
        }
        if (block === "---") return <hr key={key} className="border-zinc-700" />
        return <p key={key} className="whitespace-pre-wrap leading-7">{block}</p>
      })}
    </div>
  )
}
