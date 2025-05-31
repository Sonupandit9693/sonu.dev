import Image from "next/image";
import { Calendar, Clock, Eye, Heart, MessageCircle, ArrowRight } from "lucide-react";
import { blogPosts } from "../data/posts";

interface AllPostsProps {
  selectedCategory: string;
  searchTerm: string;
  postViews: Record<string, number>;
}

export default function AllPosts({ selectedCategory, searchTerm, postViews }: AllPostsProps) {
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
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
              <div className="p-6 flex-1 flex flex-col">
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
                <h4 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-gray-300 mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
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
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {postViews[post.id] ?? post.views}
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
  );
}