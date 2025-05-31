export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  author: {
    name: string;
    avatar: string;
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building Scalable React Applications with Next.js 14",
    excerpt:
      "Learn how to create performant and scalable React applications using the latest features in Next.js 14, including App Router and Server Components.",
    content:
      "In this comprehensive guide, we'll explore the powerful features of Next.js 14 and how they can help you build better React applications...",
    image: "",
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
      avatar: "",
    },
  },
  {
    id: 2,
    title: "Mastering TypeScript: Advanced Patterns and Best Practices",
    excerpt:
      "Dive deep into advanced TypeScript patterns, utility types, and best practices that will make your code more robust and maintainable.",
    content:
      "TypeScript has become an essential tool for modern web development. In this article, we'll explore advanced patterns...",
    image: "",
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
      avatar: "",
    },
  },
  {
    id: 3,
    title: "The Complete Guide to Modern CSS Grid and Flexbox",
    excerpt:
      "Master CSS Grid and Flexbox with practical examples and real-world use cases. Create responsive layouts that work everywhere.",
    content: "CSS Grid and Flexbox are powerful layout systems that have revolutionized how we create web layouts...",
    image: "",
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
      avatar: "",
    },
  },
];

export const categories = ["All", "React", "TypeScript", "CSS", "Backend", "Database", "DevOps"];