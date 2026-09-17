import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST - Toggle like (requires auth)
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug }
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: post.id,
          userId: session.user.id
        }
      }
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id }
      })

      const likeCount = await prisma.like.count({
        where: { postId: post.id }
      })

      return NextResponse.json({ liked: false, likeCount })
    } else {
      // Like
      await prisma.like.create({
        data: {
          postId: post.id,
          userId: session.user.id
        }
      })

      const likeCount = await prisma.like.count({
        where: { postId: post.id }
      })

      return NextResponse.json({ liked: true, likeCount })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
