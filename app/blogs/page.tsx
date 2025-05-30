"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  TrendingUp,
} from "lucide-react"
import { Navigation } from "../components/nav"

const blogPosts = [
  {
    id: 1,
    title: "Building Scalable React Applications with Next.js 14",
    excerpt:
      "Learn how to create performant and scalable React applications using the latest features in Next.js 14, including App Router and Server Components.",
    content:
      "In this comprehensive guide, we'll explore the powerful features of Next.js 14 and how they can help you build better React applications...",
    image: "/placeholder.svg?height=300&width=500",
    category: "React",
    tags: ["Next.js", "React", "JavaScript", "Web Development"],
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    views: 1250,
    likes: 89,
    comments: 23,
    featured: true,
    author: {
      name: "Your Name",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    title: "Mastering TypeScript: Advanced Patterns and Best Practices",
    excerpt:
      "Dive deep into advanced TypeScript patterns, utility types, and best practices that will make your code more robust and maintainable.",
    content:
      "TypeScript has become an essential tool for modern web development. In this article, we'll explore advanced patterns...",
    image: "/placeholder.svg?height=300&width=500",
    category: "TypeScript",
    tags: ["TypeScript", "JavaScript", "Programming", "Best Practices"],
    publishedAt: "2024-01-10",
    readTime: "12 min read",
    views: 980,
    likes: 67,
    comments: 15,
    featured: false,
    author: {
      name: "Your Name",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    title: "The Complete Guide to Modern CSS Grid and Flexbox",
    excerpt:
      "Master CSS Grid and Flexbox with practical examples and real-world use cases. Create responsive layouts that work everywhere.",
    content: "CSS Grid and Flexbox are powerful layout systems that have revolutionized how we create web layouts...",
    image: "/placeholder.svg?height=300&width=500",
    category: "CSS",
    tags: ["CSS", "Grid", "Flexbox", "Responsive Design"],
    publishedAt: "2024-01-05",
    readTime: "10 min read",
    views: 1450,
    likes: 102,
    comments: 31,
    featured: true,
    author: {
      name: "Your Name",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },

]

const categories = ["All", "React", "TypeScript", "CSS", "Backend", "Database", "DevOps"]

export default function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredPosts = blogPosts.filter((post) => post.featured)
  const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0)
  const totalLikes = blogPosts.reduce((sum, post) => sum + post.likes, 0)

  return (
    <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-10">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        </div>
        {/* Header */}
        <Navigation/>
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Blogs & Articles
          </h2>
          <p className="mt-4 text-zinc-400">
            Explore my collection of articles, tutorials, and guides on web development, programming, and technology.
            Stay updated with the latest trends and best practices in the industry.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-300"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-3 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Featured Posts */}
        {selectedCategory === "All" && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-yellow-400" />
              Featured Articles
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <div key={post.id} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                          FEATURED
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                        {post.title}
                      </h4>
                      <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </span>
                        </div>
                        <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Posts Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-8">
            {selectedCategory === "All" ? "All Articles" : `${selectedCategory} Articles`}
            <span className="text-gray-400 text-lg ml-2">({filteredPosts.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <div key={post.id} className="group relative" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Meta Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="text-gray-300 mb-4 flex-1 line-clamp-3">{post.excerpt}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full border border-white/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments}
                        </span>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More / Newsletter */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6">
              Subscribe to my newsletter to get the latest articles and tutorials delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>

          <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            Load More Articles
          </button>
        </div>
        <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      </div>

  )
}
