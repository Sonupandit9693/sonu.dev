import { Redis } from "@upstash/redis";
import ExperienceClient from "./components/ExperienceClient";

// Initialize Redis client
const redis = Redis.fromEnv();

// Revalidate page every 60 seconds for ISR
export const revalidate = 60;

export default async function ExperiencePage() {
  // Fetch page views from Redis
  const pageKey = ["pageviews", "experience"].join(":");
  const views = (await redis.get<number>(pageKey)) ?? 0;

  // Increment view count in Redis
  await redis.incr(pageKey);

  return <ExperienceClient views={views} />;
}