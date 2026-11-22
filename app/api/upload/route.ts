import { PutObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getS3Configuration,
  isSupportedImageType,
  MAX_IMAGE_SIZE,
} from "@/lib/s3"

export const runtime = "nodejs"

async function readImageBody(request: Request) {
  const reader = request.body?.getReader()
  if (!reader) return new Uint8Array()

  const chunks: Uint8Array[] = []
  let size = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    size += value.byteLength
    if (size > MAX_IMAGE_SIZE) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }

  const body = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  return body
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const contentType = request.headers.get("content-type")?.toLowerCase() ?? ""
  const contentLength = Number(request.headers.get("content-length") ?? 0)

  if (!isSupportedImageType(contentType)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 415 })
  }

  if (contentLength > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "Image must be 5MB or smaller" }, { status: 413 })
  }

  try {
    const body = await readImageBody(request)

    if (!body) {
      return NextResponse.json({ error: "Image must be 5MB or smaller" }, { status: 413 })
    }

    if (body.byteLength === 0) {
      return NextResponse.json({ error: "Image must be between 1 byte and 5MB" }, { status: 413 })
    }

    const { bucket, client } = getS3Configuration()
    const remoteFileKey = `upload-${randomUUID()}`

    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: remoteFileKey,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }))

    return NextResponse.json({ url: `/api/files/${remoteFileKey}` })
  } catch (error) {
    console.error("Image upload failed:", error)
    if (error instanceof Error && error.message.includes("must be configured")) {
      return NextResponse.json({ error: "Image storage is not configured" }, { status: 503 })
    }
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 })
  }
}
