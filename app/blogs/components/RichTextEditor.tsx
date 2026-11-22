"use client"

import { PubwaveEditor } from "@pubwave/editor"
import type { ComponentProps } from "react"
import { useCallback } from "react"

export type EditorDocument = NonNullable<ComponentProps<typeof PubwaveEditor>["content"]>

interface RichTextEditorProps {
  value: EditorDocument
  onChange?: (content: EditorDocument) => void
  placeholder?: string
  editable?: boolean
}

const editorTheme = {
  colors: {
    background: "#09090b",
    text: "#d4d4d8",
    textMuted: "#71717a",
    border: "#27272a",
    primary: "#e4e4e7",
    linkColor: "#e4e4e7",
  },
  containerClassName: "blog-editor-shell",
  contentClassName: "blog-editor-content",
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  editable = true,
}: RichTextEditorProps) {
  const uploadImage = useCallback(async (file: File) => {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    })

    if (!response.ok) {
      const result = await response.json().catch(() => null)
      throw new Error(result?.error || "Image upload failed")
    }

    const result: { url: string } = await response.json()
    return result.url
  }, [])

  return (
    <PubwaveEditor
      content={value}
      editable={editable}
      onChange={editable ? onChange : undefined}
      placeholder={placeholder}
      imageUpload={editable ? {
        handler: uploadImage,
        maxSize: 5 * 1024 * 1024,
        accept: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      } : undefined}
      theme={editorTheme}
      className="blog-editor"
    />
  )
}
