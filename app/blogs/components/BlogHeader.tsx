import { Eye } from "lucide-react";

interface BlogHeaderProps {
  pageViews: number;
}

export default function BlogHeader({ pageViews }: BlogHeaderProps) {
  return (
    <div className="max-w-2xl mx-auto lg:mx-0">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
        Blogs & Articles
      </h2>
      <p className="mt-4 text-zinc-400">
        Explore my collection of articles, tutorials, and guides on web development, programming, and technology.
        Stay updated with the latest trends and best practices in the industry.
      </p>
      <div className="mt-2 flex items-center space-x-2 text-gray-400 text-sm">
        <Eye className="w-4 h-4" />
        <span>{pageViews.toLocaleString()} views</span>
      </div>
    </div>
  );
}