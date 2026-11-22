import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { requireAdmin } from "@/lib/authz"
import { validatePostContent } from "@/lib/blog-content"
import { prisma } from "@/lib/prisma"
import { publicAuthorSelect, publicPostSelect } from "@/lib/public-fields"

// GET - Fetch all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: {
        ...publicPostSelect,
        author: { select: publicAuthorSelect },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST - Create new post (admin only)
export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin.ok) return admin.response

    const body = await request.json()
    const { title, content, excerpt, slug, videoUrl, thumbnail, published = true } = body

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 200 ||
      typeof content !== "string" ||
      content.length > 2 * 1024 * 1024 ||
      typeof slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
      typeof published !== "boolean" ||
      (excerpt !== null && excerpt !== undefined && (typeof excerpt !== "string" || excerpt.length > 500)) ||
      (videoUrl !== null && videoUrl !== undefined && typeof videoUrl !== "string") ||
      (thumbnail !== null && thumbnail !== undefined && typeof thumbnail !== "string")
    ) {
      return NextResponse.json(
        { error: "Post details are invalid or exceed the allowed limits" },
        { status: 400 }
      )
    }

    const contentError = validatePostContent(content, published)
    if (contentError) {
      return NextResponse.json({ error: contentError }, { status: 400 })
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: "Slug already exists. Please choose a different URL slug." },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: excerpt || null,
        slug,
        videoUrl: videoUrl || null,
        thumbnail: thumbnail || null,
        published,
        authorId: admin.userId,
      },
      select: {
        ...publicPostSelect,
        author: { select: publicAuthorSelect },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: unknown) {
    console.error("Error creating post:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 })
      }
      if (error.code === "P2003") {
        return NextResponse.json({ error: "Invalid user. Please log out and log back in." }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
