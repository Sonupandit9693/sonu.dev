import { Search, Filter } from "lucide-react";
import { categories } from "../data/posts";

interface SearchAndFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export default function SearchAndFilters({
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
}: SearchAndFiltersProps) {
  return (
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
  );
}