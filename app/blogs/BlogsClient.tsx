"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Heart, MessageCircle, Eye, Calendar } from "lucide-react"
import AuthModal from "../components/AuthModal"

interface Post {
  id: string
  title: string
  excerpt: string | null
  slug: string
  thumbnail: string | null
  videoUrl: string | null
  createdAt: string
  views: number
  author: {
    name: string | null
    email: string | null
  }
  _count: {
    likes: number
    comments: number
  }
}

export default function BlogsClient() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-400">Loading posts...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
            <p className="text-zinc-400 text-lg">
              Thoughts on development, design, and technology
            </p>
          </div>

          {!session ? (
            <button
              onClick={() => {
                setAuthMode("signup")
                setShowAuthModal(true)
              }}
              className="px-6 py-3 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Sign Up / Login
            </button>
          ) : (
            <Link
              href="/blogs/create"
              className="px-6 py-3 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Create New Post
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg mb-4">No blog posts yet. Be the first to write one!</p>
            {!session && (
              <button
                onClick={() => {
                  setAuthMode("signup")
                  setShowAuthModal(true)
                }}
                className="inline-block px-6 py-2 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Sign Up to Create Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blogs/${post.slug}`}
                className="group bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:scale-105"
              >
                {post.thumbnail ? (
                  <div className="aspect-video overflow-hidden bg-zinc-800">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                    <div className="text-zinc-600 text-6xl font-bold">
                      {post.title.charAt(0)}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-zinc-300 transition-colors">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(post.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={14} />
                      {post._count.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {post._count.comments}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSuccess={() => {
          setShowAuthModal(false)
          fetchPosts()
        }}
      />
    </div>
  )
}
