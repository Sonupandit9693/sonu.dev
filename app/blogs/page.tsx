import { Navigation } from "../components/nav"
import BlogsClient from "./BlogsClient"

export const metadata = {
  title: "Blog | sonu.dev",
  description: "Thoughts on development, design, and technology",
}

export default function BlogsPage() {
  return (
    <div className="relative">
      <Navigation />
      <BlogsClient />
    </div>
  )
}
