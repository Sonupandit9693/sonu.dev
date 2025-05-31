import Image from "next/image";
import { ArrowRight, Calendar, Clock, Eye, Heart, TrendingUp } from "lucide-react";
import { blogPosts } from "../data/posts";

interface FeaturedPostsProps {
  selectedCategory: string;
  postViews: Record<string, number>;
}

export default function FeaturedPosts({ selectedCategory, postViews }: FeaturedPostsProps) {
  const featuredPosts = blogPosts.filter((post) => post.featured);

  if (selectedCategory !== "All" || featuredPosts.length === 0) {
    return null;
  }

  return (
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
                      {postViews[post.id] ?? post.views}
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
  );
}