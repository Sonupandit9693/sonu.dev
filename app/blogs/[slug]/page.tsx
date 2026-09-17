"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Heart, MessageCircle, Eye, Calendar, User, Trash2, Edit2, X } from "lucide-react"
import AuthModal from "../../components/AuthModal"

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

export default function BlogDetail() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const slug = pathname.split("/").pop()

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup")
  const [commentContent, setCommentContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)

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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim() || !session?.user?.id) return

    try {
      const response = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentContent })
      })

      if (response.ok) {
        setCommentContent("")
        await fetchPost()
      }
    } catch (error) {
      console.error("Error creating comment:", error)
    }
  }

  const handleEditComment = async (commentId: string, content: string) => {
    setEditingCommentId(commentId)
    setEditContent(content)
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editContent.trim() || !session?.user?.id) return

    try {
      const response = await fetch(`/api/posts/${slug}/comments/${editingCommentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent })
      })

      if (response.ok) {
        setIsEditing(false)
        setEditingCommentId(null)
        setEditContent("")
        await fetchPost()
      }
    } catch (error) {
      console.error("Error updating comment:", error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!session?.user?.id) return

    setIsDeleting(true)
    setCommentToDelete(commentId)

    try {
      const response = await fetch(`/api/posts/${slug}/comments/${commentId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setIsDeleting(false)
        setCommentToDelete(null)
        await fetchPost()
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      setIsDeleting(false)
      setCommentToDelete(null)
    }
  }

  const confirmDelete = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      handleDeleteComment(commentId)
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

  const canEdit = session?.user?.id === post.author.id;

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
            <h1 className="text-3xl font-bold text-white mb-6">{post.title}</h1>

            {post.videoUrl && (
              <div className="mb-8">
                <div className="aspect-video bg-zinc-800 overflow-hidden">
                  <iframe
                    src={post.videoUrl}
                    title="Demo Video"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div className="prose prose-lg text-zinc-300 max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6">{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    {post.author.name || post.author.email?.split('@')[0] || 'Anonymous'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    {post.views} views
                  </div>
                </div>

                {session && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleLike}
                      className={`flex items-center gap-2 text-sm ${post.userLiked ? 'text-red-500' : 'text-zinc-500'} hover:text-zinc-300 transition-colors`}
                    >
                      <Heart size={18} />
                      <span>{post._count.likes}</span>
                    </button>

                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <MessageCircle size={18} />
                      <span>{post.comments.length} comments</span>
                    </button>
                  </div>
                )}

                {canEdit && (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blogs/edit/${post.slug}`}
                      className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                    >
                      <Edit2 size={18} />
                    </Link>

                    <button
                      onClick={() =>
                        window.confirm("Delete this post?") &&
                        fetch(`/api/posts/${post.id}`, { method: "DELETE" })
                          .then(() => router.push("/blogs"))
                      }
                      className="text-sm text-red-500 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {session && (
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <h2 className="text-xl font-bold text-white mb-4">Comments ({post.comments.length})</h2>

                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex gap-3">
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 min-h-[80px] resize-y bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-zinc-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={!commentContent.trim()}
                      className="px-4 py-2 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </form>

                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 mb-6 pb-4 border-b border-zinc-800 last:mb-0 last:pb-0 last:border-0">
                    <div className="flex-shrink-0">
                      {comment.user.image ? (
                        <img
                          src={comment.user.image}
                          alt={comment.user.name || "User"}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center text-white font-medium text-sm">
                          {(comment.user.name || comment.user.email?.charAt(0) || "U").toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      {isEditing && editingCommentId === comment.id ? (
                        <div className="mb-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-500"
                          />
                          <div className="flex justify-end mt-2 gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 bg-white text-zinc-900 text-sm rounded-md hover:bg-zinc-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setIsEditing(false)
                                setEditingCommentId(null)
                                setEditContent("")
                              }}
                              className="px-3 py-1 text-zinc-500 text-sm hover:text-zinc-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-white text-sm">
                              {comment.user.name || comment.user.email?.split('@')[0] || 'Anonymous'}
                            </div>
                          </div>
                          <p className="text-zinc-300 whitespace-pre-wrap">{comment.content}</p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              {timeAgo(comment.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              {session?.user?.id === comment.user.id && (
                                <>
                                  <button
                                    onClick={() => handleEditComment(comment.id, comment.content)}
                                    className="text-zinc-400 hover:text-zinc-300 underline"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => confirmDelete(comment.id)}
                                    className="ml-2 text-red-500 hover:text-red-300 underline"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {post.comments.length === 0 && (
                  <p className="text-zinc-500 text-center py-6">No comments yet. Be the first to comment!</p>
                )}
              </div>
            )}
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