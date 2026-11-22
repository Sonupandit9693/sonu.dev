import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { publicCommentSelect } from "@/lib/public-fields"
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { parseCommentContent, readJsonObject } from "@/lib/validation"

// POST - Add comment (requires auth)
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await readJsonObject(request)
    const content = parseCommentContent(body?.content)
    if (!content.ok) {
      return NextResponse.json({ error: content.error }, { status: 400 })
    }

    if (!(await checkRateLimit(RATE_LIMITS.commentPerUser, session.user.id)).allowed) {
      return NextResponse.json(
        { error: "You are commenting too quickly. Please try again later." },
        { status: 429 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: { id: true, published: true },
    })

    // Drafts are not public, so they cannot be commented on (and their
    // existence is not revealed).
    if (!post || !post.published) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.value,
        postId: post.id,
        userId: session.user.id
      },
      select: publicCommentSelect,
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
