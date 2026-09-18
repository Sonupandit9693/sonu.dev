"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Eye, Link as LinkIcon } from "lucide-react"
import BannerUpload from "@/app/components/BannerUpload"

interface Block {
  id: string
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'code' | 'quote' | 'list' | 'orderedList' | 'divider' | 'checklist'
  content: string
  checked?: boolean
}

export default function CreateBlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'paragraph', content: '' }
  ])
  const [excerpt, setExcerpt] = useState("")
  const [slug, setSlug] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const slashCommands = [
    { type: 'paragraph', label: 'Text', desc: 'Plain paragraph' },
    { type: 'heading1', label: 'Heading 1', desc: 'Large heading' },
    { type: 'heading2', label: 'Heading 2', desc: 'Medium heading' },
    { type: 'heading3', label: 'Heading 3', desc: 'Small heading' },
    { type: 'list', label: 'Bullet List', desc: 'Bulleted list' },
    { type: 'orderedList', label: 'Numbered List', desc: 'Numbered list' },
    { type: 'code', label: 'Code', desc: 'Code block' },
    { type: 'quote', label: 'Quote', desc: 'Blockquote' },
    { type: 'divider', label: 'Divider', desc: 'Horizontal line' },
  ]

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen text-zinc-400">Loading...</div>
  }

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">You must be logged in to create a blog post</p>
          <button
            onClick={() => router.push("/blogs")}
            className="text-white hover:text-zinc-300"
          >
            Go back to blogs
          </button>
        </div>
      </div>
    )
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value))
    }
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const firstBlock = document.querySelector('[data-block-id="1"]') as HTMLDivElement
      if (firstBlock) {
        firstBlock.focus()
      }
    }
  }

  const handleBlockInput = (blockId: string, e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || ''

    setBlocks(prev => prev.map(b =>
      b.id === blockId ? { ...b, content } : b
    ))

    // Check for slash command
    if (content === '/') {
      const rect = e.currentTarget.getBoundingClientRect()
      setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left })
      setShowSlashMenu(true)
      setCurrentBlockId(blockId)
      setSelectedIndex(0)
    } else if (showSlashMenu && !content.startsWith('/')) {
      setShowSlashMenu(false)
    }
  }

  const applyCommand = (type: string) => {
    if (!currentBlockId) return

    setBlocks(prev => prev.map(b =>
      b.id === currentBlockId ? { ...b, type: type as Block['type'], content: '' } : b
    ))
    setShowSlashMenu(false)

    setTimeout(() => {
      const el = document.querySelector(`[data-block-id="${currentBlockId}"]`) as HTMLDivElement
      if (el) el.focus()
    }, 0)
  }

  const handleBlockKeyDown = (blockId: string, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (showSlashMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % slashCommands.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + slashCommands.length) % slashCommands.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        applyCommand(slashCommands[selectedIndex].type)
      } else if (e.key === 'Escape') {
        setShowSlashMenu(false)
      }
      return
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const idx = blocks.findIndex(b => b.id === blockId)
      const newId = Date.now().toString()
      const newBlocks = [
        ...blocks.slice(0, idx + 1),
        { id: newId, type: 'paragraph' as const, content: '' },
        ...blocks.slice(idx + 1)
      ]
      setBlocks(newBlocks)

      setTimeout(() => {
        const el = document.querySelector(`[data-block-id="${newId}"]`) as HTMLDivElement
        if (el) el.focus()
      }, 0)
    }

    if (e.key === 'Backspace') {
      const block = blocks.find(b => b.id === blockId)
      if (block && block.content === '' && blocks.length > 1) {
        e.preventDefault()
        const idx = blocks.findIndex(b => b.id === blockId)
        const newBlocks = blocks.filter(b => b.id !== blockId)
        setBlocks(newBlocks)

        if (idx > 0) {
          setTimeout(() => {
            const prevEl = document.querySelector(`[data-block-id="${newBlocks[idx - 1].id}"]`) as HTMLDivElement
            if (prevEl) {
              prevEl.focus()
              const range = document.createRange()
              const sel = window.getSelection()
              range.selectNodeContents(prevEl)
              range.collapse(false)
              sel?.removeAllRanges()
              sel?.addRange(range)
            }
          }, 0)
        }
      }
    }
  }

  const blocksToContent = (): string => {
    const nonEmpty = blocks.filter(b => b.type === 'divider' || (b.content && b.content.trim()))
    if (nonEmpty.length === 0) return ''

    return nonEmpty.map(b => {
      switch (b.type) {
        case 'heading1': return `# ${b.content}`
        case 'heading2': return `## ${b.content}`
        case 'heading3': return `### ${b.content}`
        case 'code': return `\`\`\`\n${b.content}\n\`\`\``
        case 'quote': return `> ${b.content}`
        case 'list': return `- ${b.content}`
        case 'orderedList': return `1. ${b.content}`
        case 'divider': return '---'
        default: return b.content
      }
    }).join('\n\n')
  }

  const handlePublish = async () => {
    setError("")
    setLoading(true)

    const content = blocksToContent()

    if (!title.trim()) {
      setError("Please add a title")
      setLoading(false)
      return
    }

    if (!content.trim()) {
      setError("Please write some content in the editor")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || null,
          slug: slug.trim(),
          videoUrl: videoUrl.trim() || null,
          thumbnail: thumbnail.trim() || null,
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to create post" }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const post = await response.json()
      router.push(`/blogs/${post.slug}`)
    } catch (err) {
      console.error("Blog creation error:", err)
      setError(err instanceof Error ? err.message : "Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  const renderBlock = (block: Block) => {
    const isEmpty = !block.content
    const commonProps = {
      'data-block-id': block.id,
      contentEditable: block.type !== 'divider',
      suppressContentEditableWarning: true,
      onInput: (e: React.FormEvent<HTMLDivElement>) => handleBlockInput(block.id, e),
      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => handleBlockKeyDown(block.id, e),
      className: "outline-none focus:outline-none w-full",
      'data-placeholder': isEmpty ? 'Type / for commands' : undefined,
    }

    switch (block.type) {
      case 'heading1':
        return <h1 {...commonProps} className={`${commonProps.className} text-4xl font-bold text-white mb-2 ${isEmpty ? 'empty' : ''}`}>{block.content}</h1>
      case 'heading2':
        return <h2 {...commonProps} className={`${commonProps.className} text-3xl font-bold text-white mb-2 ${isEmpty ? 'empty' : ''}`}>{block.content}</h2>
      case 'heading3':
        return <h3 {...commonProps} className={`${commonProps.className} text-2xl font-bold text-white mb-2 ${isEmpty ? 'empty' : ''}`}>{block.content}</h3>
      case 'code':
        return <pre {...commonProps} className={`${commonProps.className} bg-zinc-800 p-4 rounded-lg font-mono text-sm text-zinc-300 ${isEmpty ? 'empty' : ''}`}>{block.content}</pre>
      case 'quote':
        return <blockquote {...commonProps} className={`${commonProps.className} border-l-4 border-zinc-600 pl-4 italic text-zinc-400 ${isEmpty ? 'empty' : ''}`}>{block.content}</blockquote>
      case 'list':
        return <div className="flex gap-2"><span className="text-zinc-500">•</span><div {...commonProps} className={`${commonProps.className} text-zinc-300 flex-1 ${isEmpty ? 'empty' : ''}`}>{block.content}</div></div>
      case 'orderedList':
        const idx = blocks.filter(b => b.type === 'orderedList' && blocks.indexOf(b) <= blocks.indexOf(block)).length
        return <div className="flex gap-2"><span className="text-zinc-500">{idx}.</span><div {...commonProps} className={`${commonProps.className} text-zinc-300 flex-1 ${isEmpty ? 'empty' : ''}`}>{block.content}</div></div>
      case 'divider':
        return <hr className="border-zinc-700 my-4" />
      default:
        return <p {...commonProps} className={`${commonProps.className} text-zinc-300 leading-relaxed ${isEmpty ? 'empty' : ''}`}>{block.content}</p>
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="text-zinc-400 hover:text-white">← Back</button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white"
              >
                <Eye size={18} />
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handlePublish}
                disabled={loading}
                className="px-6 py-2 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-200 disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {!showPreview ? (
          <div className="space-y-8">
            <BannerUpload value={thumbnail} onChange={setThumbnail} onFileSelect={setBannerFile} />

            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onKeyDown={handleTitleKeyDown}
              placeholder="Untitled"
              className="w-full text-5xl font-bold text-white bg-transparent border-none outline-none placeholder:text-zinc-700"
            />

            <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
              <div>
                <label className="text-xs text-zinc-500 mb-2 block">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-2 block">Video URL</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="YouTube link"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description..."
                className="w-full px-4 py-3 bg-zinc-900/30 border border-zinc-800 rounded-lg text-zinc-300 resize-none"
                rows={2}
              />
            </div>

            <div className="mt-12 space-y-3">
              {blocks.map(block => (
                <div key={block.id}>{renderBlock(block)}</div>
              ))}
            </div>

            {showSlashMenu && (
              <div
                className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl w-80"
                style={{ top: menuPosition.top, left: menuPosition.left }}
              >
                {slashCommands.map((cmd, i) => (
                  <button
                    key={cmd.type}
                    onClick={() => applyCommand(cmd.type)}
                    className={`w-full px-4 py-3 text-left ${i === selectedIndex ? 'bg-zinc-800' : 'hover:bg-zinc-800'}`}
                  >
                    <div className="text-white text-sm font-medium">{cmd.label}</div>
                    <div className="text-zinc-500 text-xs">{cmd.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="fixed bottom-6 right-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg max-w-md">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            {thumbnail && <img src={thumbnail} className="w-full rounded-lg mb-8" />}
            <h1 className="text-5xl font-bold mb-8">{title || 'Untitled'}</h1>
            {excerpt && <p className="text-xl text-zinc-400 italic mb-8">{excerpt}</p>}
            <div className="space-y-4">
              {blocks.filter(b => b.content || b.type === 'divider').map(b => renderBlock(b))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        [contenteditable].empty:empty:before {
          content: attr(data-placeholder);
          color: rgb(113 113 122);
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
