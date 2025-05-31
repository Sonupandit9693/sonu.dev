import { Redis } from "@upstash/redis";
import BlogClient from "./components/BlogClient";
import { blogPosts } from "./data/posts"; // Import blogPosts, not BlogPost
import { Navigation } from "../components/nav";

// Initialize Redis client
const redis = Redis.fromEnv();

// Revalidate page every 60 seconds for ISR
export const revalidate = 60;

export default async function BlogsPage() {
  // Fetch page views
  const pageKey = ["pageviews", "blogs"].join(":");
  let pageViews = 0;
  try {
    pageViews = (await redis.get<number>(pageKey)) ?? 0;
    await redis.incr(pageKey);
  } catch (error) {
    console.error("Redis page views error:", error);
  }

  // Fetch post views
  const postKeys = blogPosts.map((post) => ["pageviews", "blogs", post.id].join(":")); // Use blogPosts
  let postViews: Record<string, number> = {};
  try {
    const views = await redis.mget<number[]>(...postKeys);
    postViews = views.reduce((acc, v, i) => {
      acc[blogPosts[i].id] = v ?? 0; // Use blogPosts
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error("Redis post views error:", error);
  }

  return (
    <div className="relative">
      <Navigation />
      <BlogClient pageViews={pageViews} postViews={postViews} />
    </div>
  );
}