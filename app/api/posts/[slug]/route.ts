import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { validatePostContent } from "@/lib/blog-content"
import { prisma } from "@/lib/prisma"
import {
  publicAuthorSelect,
  publicCommentSelect,
  publicPostSelect,
} from "@/lib/public-fields"

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: {
        ...publicPostSelect,
        // Internal only: used for the draft ownership check below and
        // stripped before the response is sent.
        authorId: true,
        author: { select: publicAuthorSelect },
        comments: {
          select: publicCommentSelect,
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { likes: true } },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const session = await getServerSession(authOptions)
    if (!post.published && session?.user?.id !== post.authorId) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (post.published) {
      await prisma.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      })
    }

    let userLiked = false
    if (session?.user?.id) {
      const like = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: session.user.id,
          },
        },
      })
      userLiked = !!like
    }

    const { authorId: _authorId, ...publicPost } = post
    return NextResponse.json({ ...publicPost, userLiked })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PATCH(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: { id: true, authorId: true, content: true },
    })

    if (!post || post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const contentError = validatePostContent(post.content, true)
    if (contentError) {
      return NextResponse.json({ error: contentError }, { status: 400 })
    }

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: { published: true },
      select: { slug: true },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error publishing post:", error)
    return NextResponse.json({ error: "Failed to publish post" }, { status: 500 })
  }
}
