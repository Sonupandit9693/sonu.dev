"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Calendar, Trash2, Edit2 } from "lucide-react"

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

interface CommentSectionProps {
  slug: string
  initialComments: Comment[]
}

export default function CommentSection({ slug, initialComments }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [commentContent, setCommentContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)

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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim() || !session?.user?.id || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentContent })
      })

      if (response.ok) {
        const newComment = await response.json()
        // Add the new comment to the top of the list
        setComments(prev => [newComment, ...prev])
        setCommentContent("")
      } else {
        console.error("Failed to post comment")
      }
    } catch (error) {
      console.error("Error creating comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = (commentId: string, content: string) => {
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
        const updatedComment = await response.json()
        // Update the comment in the list
        setComments(prev => prev.map(comment =>
          comment.id === editingCommentId ? updatedComment : comment
        ))
        setIsEditing(false)
        setEditingCommentId(null)
        setEditContent("")
      }
    } catch (error) {
      console.error("Error updating comment:", error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!session?.user?.id) return

    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${slug}/comments/${commentId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        // Remove the comment from the list
        setComments(prev => prev.filter(comment => comment.id !== commentId))
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="mt-8 pt-6 border-t border-zinc-800">
      <h2 className="text-xl font-bold text-white mb-4">Comments ({comments.length})</h2>

      <form onSubmit={handleCommentSubmit} className="mb-6">
        <div className="flex gap-3">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 min-h-[80px] resize-y bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-zinc-500"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!commentContent.trim() || isSubmitting}
            className="px-4 py-2 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      {comments.map((comment) => (
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
                  {session?.user?.id === comment.user.id && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditComment(comment.id, comment.content)}
                        className="text-zinc-400 hover:text-zinc-300 underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-300 underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {comments.length === 0 && (
        <p className="text-zinc-500 text-center py-6">No comments yet. Be the first to comment!</p>
      )}
    </div>
  )
}
