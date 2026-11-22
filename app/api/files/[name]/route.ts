import { GetObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import {
  getS3Configuration,
  isSupportedImageType,
} from "@/lib/s3"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: { name: string } },
) {
  if (!/^upload-[\da-f-]{36}$/i.test(params.name)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  try {
    const { bucket, client } = getS3Configuration()
    const result = await client.send(new GetObjectCommand({
      Bucket: bucket,
      Key: params.name,
    }))

    if (!result.Body || !result.ContentType || !isSupportedImageType(result.ContentType)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const image = await result.Body.transformToByteArray()

    return new Response(image, {
      headers: {
        "Content-Type": result.ContentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("Image retrieval failed:", error)
    if (error instanceof Error && error.message.includes("must be configured")) {
      return NextResponse.json({ error: "Image storage is not configured" }, { status: 503 })
    }
    if (error instanceof Error && (error.name === "NoSuchKey" || error.name === "NotFound")) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to retrieve image" }, { status: 500 })
  }
}
