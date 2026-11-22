"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye } from "lucide-react"
import BannerUpload from "@/app/components/BannerUpload"
import RichTextEditor from "@/app/blogs/components/RichTextEditor"
import type { EditorDocument } from "@/app/blogs/components/RichTextEditor"

const emptyDocument: EditorDocument = {
  type: "doc",
  content: [{ type: "paragraph" }],
}

function hasDocumentContent(node: EditorDocument): boolean {
  if (node.type === "image" && node.attrs?.src) return true
  if (node.text?.trim()) return true
  return node.content?.some(hasDocumentContent) ?? false
}

function containsEmbeddedImage(node: EditorDocument): boolean {
  if (typeof node.attrs?.src === "string" && node.attrs.src.startsWith("data:image/")) {
    return true
  }
  return node.content?.some(containsEmbeddedImage) ?? false
}

export default function CreateBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState<EditorDocument>(emptyDocument)
  const [excerpt, setExcerpt] = useState("")
  const [slug, setSlug] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const generateSlug = (value: string) =>
    value.toLowerCase().trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "")

  const handleSave = async (published: boolean) => {
    setError("")

    if (!title.trim()) {
      setError("Please add a title")
      return
    }
    if (!slug.trim()) {
      setError("Please add a URL slug")
      return
    }
    if (published && !hasDocumentContent(content)) {
      setError("Please write some content before publishing")
      return
    }
    if (containsEmbeddedImage(content) || thumbnail.startsWith("data:image/")) {
      setError("An image could not be uploaded. Please upload it again before saving.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: JSON.stringify(content),
          excerpt: excerpt.trim() || null,
          slug: slug.trim(),
          videoUrl: videoUrl.trim() || null,
          thumbnail: thumbnail.trim() || null,
          published,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || `Unable to ${published ? "publish" : "save"} the post`)
      }

      router.push(published ? `/blogs/${result.slug}` : "/blogs/drafts")
    } catch (saveError) {
      console.error("Blog save failed:", saveError)
      setError(saveError instanceof Error ? saveError.message : "Unable to save the post")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-zinc-400">Loading...</div>
  }

  if (!session?.user?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-zinc-400">You must be logged in to create a blog post</p>
          <button type="button" onClick={() => router.push("/blogs")} className="text-white hover:text-zinc-300">
            Go back to blogs
          </button>
        </div>
      </div>
    )
  }

  // UI only: the API rejects non-admin create and upload requests regardless.
  if (!session.user.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-zinc-400">Only the site admin can create blog posts.</p>
          <button type="button" onClick={() => router.push("/blogs")} className="text-white hover:text-zinc-300">
            Go back to blogs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <button type="button" onClick={() => router.back()} className="text-zinc-400 hover:text-white">
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white"
              aria-pressed={showPreview}
            >
              <Eye size={18} />
              {showPreview ? "Edit" : "Preview"}
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={loading}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={loading}
              className="rounded-lg bg-white px-6 py-2 font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-6 py-12">
        {!showPreview ? (
          <div className="space-y-8">
            <BannerUpload value={thumbnail} onChange={setThumbnail} />

            <input
              type="text"
              value={title}
              onChange={(event) => {
                const nextTitle = event.target.value
                setTitle(nextTitle)
                if (!slug || slug === generateSlug(title)) setSlug(generateSlug(nextTitle))
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  document.querySelector<HTMLElement>(".blog-editor__content")?.focus()
                }
              }}
              placeholder="Untitled"
              aria-label="Post title"
              className="w-full border-none bg-transparent text-5xl font-bold text-white outline-none placeholder:text-zinc-700"
            />

            <div className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 md:grid-cols-2">
              <div>
                <label htmlFor="post-slug" className="mb-2 block text-xs text-zinc-500">URL Slug</label>
                <input
                  id="post-slug"
                  type="text"
                  value={slug}
                  onChange={(event) => setSlug(generateSlug(event.target.value))}
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-sm text-white"
                />
              </div>
              <div>
                <label htmlFor="video-url" className="mb-2 block text-xs text-zinc-500">Video URL</label>
                <input
                  id="video-url"
                  type="url"
                  value={videoUrl}
                  onChange={(event) => setVideoUrl(event.target.value)}
                  placeholder="YouTube link"
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="post-excerpt" className="mb-2 block text-sm text-zinc-400">Excerpt</label>
              <textarea
                id="post-excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Brief description..."
                className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-zinc-300"
                rows={2}
              />
            </div>

            <RichTextEditor value={content} onChange={setContent} />
            {error && (
              <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
                {error}
              </p>
            )}
          </div>
        ) : (
          <article className="space-y-8">
            {thumbnail && <img src={thumbnail} alt="" className="w-full rounded-lg" />}
            <h1 className="text-5xl font-bold text-white">{title || "Untitled"}</h1>
            {excerpt && <p className="text-xl italic text-zinc-400">{excerpt}</p>}
            <RichTextEditor key="preview" value={content} editable={false} />
            {error && (
              <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
                {error}
              </p>
            )}
          </article>
        )}
      </main>
    </div>
  )
}
