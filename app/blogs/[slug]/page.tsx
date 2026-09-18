"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Heart, MessageCircle, Eye, Calendar, User, Trash2, Edit2, X } from "lucide-react"
import AuthModal from "../../components/AuthModal"
import CommentSection from "../components/CommentSection"

interface Post {
  id: string
  title: string
  content: string
  excerpt: string | null
  slug: string
  thumbnail: string | null
  videoUrl: string | null
  published: boolean
  createdAt: string
  updatedAt: string
  views: number
  author: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  comments: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      id: string
      name: string | null
      email: string | null
      image: string | null
    }
  }>
  _count: {
    likes: number
  }
  userLiked: boolean
}

// Helper function to convert YouTube URL to embed format
const getEmbedUrl = (url: string): string => {
  if (!url) return url

  // Handle youtube.com/watch?v=VIDEO_ID format
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`
  }

  // Handle youtube.com/embed/VIDEO_ID format (already correct)
  if (url.includes('youtube.com/embed/')) {
    return url
  }

  // Handle youtu.be/VIDEO_ID format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`
  }

  // Return original URL if no YouTube pattern matched
  return url
}

export default function BlogDetail() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const slug = pathname?.split("/").pop()

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup")

  useEffect(() => {
    if (!slug) {
      router.push("/blogs")
      return
    }

    fetchPost()
  }, [slug, router])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${slug}`)
      const data = await response.json()
      setPost(data)
    } catch (error) {
      console.error("Error fetching post:", error)
      router.push("/blogs")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHours = Math.round(diffMin / 60)
    const diffDays = Math.round(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMin > 0) return `${diffMin}m ago`
    return "just now"
  }

  const toggleLike = async () => {
    if (!session?.user?.id) {
      setShowAuthModal(true)
      return
    }

    if (!post) return

    try {
      const response = await fetch(`/api/posts/${slug}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const result = await response.json()
      if (result.success !== false) {
        setPost(prev => prev ? { ...prev, userLiked: result.liked, _count: { ...prev._count, likes: result.likeCount } } : null)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-400">Loading post...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-400">Post not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/blogs" className="text-zinc-400 hover:text-zinc-300 transition-colors">
            ← Back to Blog
          </Link>
        </div>

        <article className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
          {post.thumbnail ? (
            <div className="aspect-video overflow-hidden bg-zinc-800">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <div className="text-zinc-600 text-9xl font-bold">
                {post.title.charAt(0)}
              </div>
            </div>
          )}

          <div className="p-8">
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">{post.title}</h1>

            {/* Metadata Section */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-8 pb-6 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.image || `https://ui-avatars.com/api/?name=${post.author.name || 'Author'}`}
                  alt={post.author.name || 'Author'}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium text-white">{post.author.name || post.author.email?.split('@')[0] || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(post.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Eye size={16} />
                {post.views.toLocaleString()} views
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
              </div>
            </div>

            {post.videoUrl && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-white mb-4">Demo Video</h2>
                <div className="aspect-video bg-zinc-800 overflow-hidden rounded-lg border border-zinc-800 shadow-2xl">
                  <iframe
                    src={getEmbedUrl(post.videoUrl)}
                    title="Demo Video"
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-invert max-w-none mb-12">
              <style jsx>{`
                .prose {
                  --tw-prose-body: rgb(212 212 212);
                  --tw-prose-headings: rgb(255 255 255);
                  --tw-prose-lead: rgb(161 161 170);
                  --tw-prose-links: rgb(255 255 255);
                  --tw-prose-bold: rgb(255 255 255);
                  --tw-prose-counters: rgb(161 161 170);
                  --tw-prose-bullets: rgb(113 113 122);
                  --tw-prose-hr: rgb(39 39 42);
                  --tw-prose-quotes: rgb(161 161 170);
                  --tw-prose-quote-borders: rgb(63 63 70);
                  --tw-prose-captions: rgb(161 161 170);
                  --tw-prose-kbd: rgb(255 255 255);
                  --tw-prose-kbd-shadows: rgb(24 24 27 / 0.1);
                  --tw-prose-code: rgb(248 113 113);
                  --tw-prose-pre-bg: rgb(24 24 27);
                  --tw-prose-pre-code: rgb(212 212 212);
                }

                .prose h1, .prose h2, .prose h3, .prose h4 {
                  margin-top: 1.5em;
                  margin-bottom: 0.75em;
                  font-weight: 700;
                  line-height: 1.25;
                }

                .prose h1 {
                  font-size: 2.25em;
                }

                .prose h2 {
                  font-size: 1.875em;
                }

                .prose h3 {
                  font-size: 1.5em;
                }

                .prose p {
                  margin-bottom: 1.25em;
                  line-height: 1.75;
                }

                .prose ul, .prose ol {
                  margin: 1.25em 0;
                  padding-left: 1.625em;
                }

                .prose li {
                  margin: 0.5em 0;
                  line-height: 1.75;
                }

                .prose code {
                  background-color: rgb(39 39 42);
                  padding: 0.2em 0.4em;
                  border-radius: 0.25em;
                  font-size: 0.9em;
                  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                }

                .prose pre {
                  background-color: rgb(24 24 27);
                  padding: 1.25em;
                  border-radius: 0.5em;
                  overflow-x: auto;
                  border: 1px solid rgb(63 63 70);
                  margin: 1.25em 0;
                }

                .prose pre code {
                  background-color: transparent;
                  padding: 0;
                  color: rgb(212 212 212);
                  font-size: 0.875em;
                }

                .prose blockquote {
                  border-left: 4px solid rgb(113 113 122);
                  padding-left: 1.25em;
                  color: rgb(161 161 170);
                  font-style: italic;
                  margin: 1.5em 0;
                }

                .prose a {
                  color: rgb(255 255 255);
                  text-decoration: underline;
                  text-decoration-color: rgb(113 113 122);
                  transition: all 0.2s;
                }

                .prose a:hover {
                  color: rgb(212 212 212);
                  text-decoration-color: rgb(212 212 212);
                }

                .prose hr {
                  border-color: rgb(39 39 42);
                  margin: 2em 0;
                }

                .prose table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1.5em 0;
                }

                .prose th {
                  background-color: rgb(39 39 42);
                  padding: 0.75em;
                  text-align: left;
                  font-weight: 600;
                }

                .prose td {
                  border-bottom: 1px solid rgb(39 39 42);
                  padding: 0.75em;
                }
              `}</style>
              {post.content.split('\n\n').map((paragraph, index) => {
                // Handle headings
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index}>{paragraph.replace('# ', '')}</h1>
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index}>{paragraph.replace('## ', '')}</h2>
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index}>{paragraph.replace('### ', '')}</h3>
                }
                // Handle code blocks
                if (paragraph.startsWith('```')) {
                  const codeContent = paragraph.replace(/```/g, '').trim()
                  return <pre key={index}><code>{codeContent}</code></pre>
                }
                // Handle quotes
                if (paragraph.startsWith('> ')) {
                  return <blockquote key={index}>{paragraph.replace('> ', '')}</blockquote>
                }
                // Handle lists
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter(line => line.startsWith('- '))
                  return (
                    <ul key={index}>
                      {items.map((item, i) => (
                        <li key={i}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  )
                }
                // Handle ordered lists
                if (paragraph.match(/^\d+\. /)) {
                  const items = paragraph.split('\n').filter(line => line.match(/^\d+\. /))
                  return (
                    <ol key={index}>
                      {items.map((item, i) => (
                        <li key={i}>{item.replace(/^\d+\. /, '')}</li>
                      ))}
                    </ol>
                  )
                }
                // Regular paragraph
                return <p key={index}>{paragraph}</p>
              })}
            </div>

            {/* Engagement Section */}
            <div className="py-8 border-t border-b border-zinc-800 mb-8">
              <div className="flex items-center gap-6">
                {session ? (
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${post.userLiked
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                  >
                    <Heart size={20} fill={post.userLiked ? 'currentColor' : 'none'} />
                    <span className="font-medium">{post._count.likes}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 text-zinc-400">
                    <Heart size={20} />
                    <span className="font-medium">{post._count.likes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Comment Section */}
            <CommentSection slug={slug} initialComments={post.comments} />
          </div>
        </article>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSuccess={() => {
          setShowAuthModal(false)
          fetchPost()
        }}
      />
    </div>
  )
}