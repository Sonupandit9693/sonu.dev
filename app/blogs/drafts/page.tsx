"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Draft {
  id: string
  title: string
  excerpt: string | null
  slug: string
  thumbnail: string | null
  updatedAt: string
}

export default function DraftsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [error, setError] = useState("")
  const [publishingSlug, setPublishingSlug] = useState<string | null>(null)

  useEffect(() => {
    if (status !== "authenticated") return

    fetch("/api/posts/drafts")
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || "Failed to load drafts")
        setDrafts(result)
      })
      .catch((fetchError: unknown) => {
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load drafts")
      })
  }, [status])

  const publishDraft = async (draft: Draft) => {
    setError("")
    setPublishingSlug(draft.slug)

    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(draft.slug)}`, {
        method: "PATCH",
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to publish draft")
      router.push(`/blogs/${draft.slug}`)
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Failed to publish draft")
    } finally {
      setPublishingSlug(null)
    }
  }

  if (status === "loading") {
    return <p className="mx-auto max-w-4xl px-6 py-20 text-zinc-400">Loading drafts...</p>
  }

  if (!session?.user?.id) {
    return <p className="mx-auto max-w-4xl px-6 py-20 text-zinc-400">Sign in to view your drafts.</p>
  }

  return (
    <main className="container mx-auto min-h-screen max-w-4xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Your drafts</h1>
          <p className="mt-2 text-zinc-400">Unpublished posts are visible only to you.</p>
        </div>
        <Link href="/blogs/create" className="rounded-lg bg-white px-4 py-2 font-medium text-zinc-900">
          New post
        </Link>
      </div>

      {error && <p role="alert" className="mb-6 text-red-400">{error}</p>}
      {drafts.length === 0 ? (
        <p className="rounded-lg border border-zinc-800 p-6 text-zinc-400">You have no saved drafts.</p>
      ) : (
        <ul className="space-y-4">
          {drafts.map((draft) => (
            <li key={draft.id} className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 sm:flex-row sm:items-center">
              {draft.thumbnail && (
                <img src={draft.thumbnail} alt="" className="h-20 w-32 rounded object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-semibold text-white">{draft.title}</h2>
                {draft.excerpt && <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{draft.excerpt}</p>}
                <p className="mt-2 text-xs text-zinc-500">
                  Updated {new Date(draft.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <Link href={`/blogs/${encodeURIComponent(draft.slug)}`} className="rounded border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800">
                  Preview
                </Link>
                <button
                  type="button"
                  onClick={() => publishDraft(draft)}
                  disabled={publishingSlug !== null}
                  className="rounded bg-white px-3 py-2 text-sm font-medium text-zinc-900 disabled:opacity-50"
                >
                  {publishingSlug === draft.slug ? "Publishing..." : "Publish"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
