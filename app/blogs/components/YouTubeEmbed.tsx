import { parseYouTubeId, youTubeEmbedUrl } from "@/lib/video"

interface YouTubeEmbedProps {
  url: string | null | undefined
  title?: string
}

// Renders nothing unless the URL is a valid YouTube link. The src is rebuilt
// from the validated video ID, never taken from the stored URL.
// Sandbox is the minimum the player needs: allow-scripts (the player is JS)
// and allow-same-origin (keeps the frame's own youtube-nocookie.com origin,
// which is always cross-origin to this site). No popups, forms or navigation.
export default function YouTubeEmbed({ url, title = "Demo Video" }: YouTubeEmbedProps) {
  const id = parseYouTubeId(url)
  if (!id) return null

  return (
    <iframe
      src={youTubeEmbedUrl(id)}
      title={title}
      className="w-full h-full"
      sandbox="allow-scripts allow-same-origin"
      allow="encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      loading="lazy"
    />
  )
}
