"use client";

import { useState } from "react";
import BlogHeader from "./BlogHeader";
import SearchAndFilters from "./SearchAndFilters";
import FeaturedPosts from "./FeaturedPosts";
import AllPosts from "./AllPosts";
import Newsletter from "./Newsletter";

interface BlogClientProps {
  pageViews: number;
  postViews: Record<string, number>;
}

export default function BlogClient({ pageViews, postViews }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-10 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <BlogHeader pageViews={pageViews} />
      <div className="w-full h-px bg-zinc-800" />
      <SearchAndFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      <FeaturedPosts selectedCategory={selectedCategory} postViews={postViews} />
      <AllPosts
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        postViews={postViews}
      />
      <Newsletter />

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
  );
}