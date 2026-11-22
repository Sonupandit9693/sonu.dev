import { S3Client } from "@aws-sdk/client-s3"

const supportedImageTypes = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
])

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function isSupportedImageType(contentType: string) {
  return supportedImageTypes.has(contentType.toLowerCase())
}

export function getS3Configuration() {
  const region = process.env.S3_REGION
  const bucket = process.env.S3_BUCKET
  const accessKeyId = process.env.S3_ACCESS_KEY
  const secretAccessKey = process.env.S3_ACCESS_SECRET_KEY

  if (!region || !bucket) {
    throw new Error("S3_REGION and S3_BUCKET must be configured")
  }

  if ((accessKeyId && !secretAccessKey) || (!accessKeyId && secretAccessKey)) {
    throw new Error("Both S3_ACCESS_KEY and S3_ACCESS_SECRET_KEY must be configured together")
  }

  return {
    bucket,
    client: new S3Client({
      region,
      ...(accessKeyId && secretAccessKey
        ? { credentials: { accessKeyId, secretAccessKey } }
        : {}),
    }),
  }
}
