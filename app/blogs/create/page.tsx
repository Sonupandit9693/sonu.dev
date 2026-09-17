"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { X } from "lucide-react"
import BannerUpload from "@/app/components/BannerUpload"

export default function CreateBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [slug, setSlug] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">You must be logged in to create a blog post</p>
          <button
            onClick={() => router.push("/blogs")}
            className="text-white hover:text-zinc-300"
          >
            Go back to blogs
          </button>
        </div>
      </div>
    )
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!title.trim() || !content.trim() || !slug.trim()) {
      setError("Title, content, and slug are required")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || null,
          slug: slug.trim(),
          videoUrl: videoUrl.trim() || null,
          thumbnail: thumbnail.trim() || null,
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to create post" }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const post = await response.json()
      router.push(`/blogs/${post.slug}`)
    } catch (err) {
      console.error("Blog creation error:", err)
      setError(err instanceof Error ? err.message : "Failed to create post. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Blog Post</h1>
          <p className="text-zinc-400">Share your thoughts and knowledge with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Your blog post title"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-zinc-300 mb-2">
              URL Slug *
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-title"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 font-mono text-sm"
              required
            />
            <p className="text-xs text-zinc-500 mt-1">
              sonu.dev/blogs/{slug || "your-slug"}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-zinc-300 mb-2">
              Excerpt (optional)
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of your post"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 resize-y min-h-[60px]"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-zinc-300 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here... (Markdown supported)"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500 resize-y min-h-[300px] font-mono text-sm"
              required
            />
            <p className="text-xs text-zinc-500 mt-1">
              Separate paragraphs with blank lines. Basic formatting supported.
            </p>
          </div>

          {/* Video URL */}
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-zinc-300 mb-2">
              Demo Video URL (optional)
            </label>
            <input
              id="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/... or any iframe embed URL"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-500"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Paste an embeddable video URL (YouTube embed, Vimeo, etc.)
            </p>
          </div>

          {/* Banner/Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Banner Image (optional)
            </label>
            <BannerUpload
              value={thumbnail}
              onChange={setThumbnail}
              onFileSelect={setBannerFile}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
