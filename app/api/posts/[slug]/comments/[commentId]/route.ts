import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { publicCommentSelect } from "@/lib/public-fields"
import { parseCommentContent, readJsonObject } from "@/lib/validation"

// PUT - Update comment (requires auth and ownership)
export async function PUT(
  request: Request,
  { params }: { params: { slug: string; commentId: string } }
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

    // Check if comment exists and user owns it
    const existingComment = await prisma.comment.findUnique({
      where: { id: params.commentId }
    })

    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (existingComment.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const comment = await prisma.comment.update({
      where: { id: params.commentId },
      data: { content: content.value },
      select: publicCommentSelect,
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

// DELETE - Delete comment (requires auth and ownership)
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if comment exists and user owns it
    const existingComment = await prisma.comment.findUnique({
      where: { id: params.commentId }
    })

    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (existingComment.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.comment.delete({
      where: { id: params.commentId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
