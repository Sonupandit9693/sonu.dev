"use client"

import { useEffect, useRef, useState } from "react"
import {
  Type,
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  Minus,
  CheckSquare
} from "lucide-react"

interface Block {
  id: string
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'code' | 'quote' | 'list' | 'orderedList' | 'divider' | 'checklist'
  content: string
  checked?: boolean
}

interface RichTextEditorProps {
  value: Block[]
  onChange: (blocks: Block[]) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = "Type '/' for commands..." }: RichTextEditorProps) {
  const initialBlocks = value.length > 0 ? value : [
    { id: 'initial-' + Date.now().toString(), type: 'paragraph' as const, content: '' }
  ]
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 })
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null)
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
  const editorRef = useRef<HTMLDivElement>(null)

  const slashCommands = [
    { icon: <Type size={16} />, label: 'Text', description: 'Plain text paragraph', type: 'paragraph' },
    { icon: <Heading1 size={16} />, label: 'Heading 1', description: 'Large section heading', type: 'heading1' },
    { icon: <Heading2 size={16} />, label: 'Heading 2', description: 'Medium section heading', type: 'heading2' },
    { icon: <Heading3 size={16} />, label: 'Heading 3', description: 'Small section heading', type: 'heading3' },
    { icon: <List size={16} />, label: 'Bulleted List', description: 'Simple bullet list', type: 'list' },
    { icon: <ListOrdered size={16} />, label: 'Numbered List', description: 'Numbered list', type: 'orderedList' },
    { icon: <CheckSquare size={16} />, label: 'Checklist', description: 'To-do list with checkboxes', type: 'checklist' },
    { icon: <Code size={16} />, label: 'Code Block', description: 'Code with syntax', type: 'code' },
    { icon: <Quote size={16} />, label: 'Quote', description: 'Capture a quote', type: 'quote' },
    { icon: <Minus size={16} />, label: 'Divider', description: 'Visual divider', type: 'divider' },
  ]

  useEffect(() => {
    if (blocks.length > 0) {
      onChange(blocks)
    }
  }, [blocks])

  // Auto-focus first block on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstBlock = document.querySelector('[data-block-id]') as HTMLDivElement
      if (firstBlock && blocks.length === 1 && blocks[0].content === '') {
        firstBlock.focus()
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleInput = (blockId: string, content: string, e: React.FormEvent<HTMLDivElement>) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, content } : block
    )
    setBlocks(updatedBlocks)

    // Check for slash command
    if (content === '/') {
      const target = e.target as HTMLDivElement
      const rect = target.getBoundingClientRect()
      setSlashMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      })
      setShowSlashMenu(true)
      setCurrentBlockId(blockId)
      setSelectedCommandIndex(0)
    } else if (showSlashMenu && !content.startsWith('/')) {
      setShowSlashMenu(false)
    }
  }

  const applyCommand = (type: string) => {
    if (!currentBlockId) return

    const updatedBlocks = blocks.map(block =>
      block.id === currentBlockId
        ? { ...block, type: type as Block['type'], content: '' }
        : block
    )
    setBlocks(updatedBlocks)
    setShowSlashMenu(false)

    // Focus the updated block
    setTimeout(() => {
      const blockElement = document.querySelector(`[data-block-id="${currentBlockId}"]`) as HTMLDivElement
      if (blockElement) {
        blockElement.focus()
      }
    }, 0)
  }

  const handleKeyDown = (blockId: string, e: React.KeyboardEvent<HTMLDivElement>) => {
    const block = blocks.find(b => b.id === blockId)
    if (!block) return

    // Slash menu navigation
    if (showSlashMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedCommandIndex(prev => (prev + 1) % slashCommands.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedCommandIndex(prev => (prev - 1 + slashCommands.length) % slashCommands.length)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        applyCommand(slashCommands[selectedCommandIndex].type)
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setShowSlashMenu(false)
        return
      }
    }

    // Enter key - create new block
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const blockIndex = blocks.findIndex(b => b.id === blockId)
      const newBlock: Block = {
        id: Date.now().toString(),
        type: 'paragraph',
        content: ''
      }
      const newBlocks = [
        ...blocks.slice(0, blockIndex + 1),
        newBlock,
        ...blocks.slice(blockIndex + 1)
      ]
      setBlocks(newBlocks)

      setTimeout(() => {
        const newBlockElement = document.querySelector(`[data-block-id="${newBlock.id}"]`) as HTMLDivElement
        if (newBlockElement) {
          newBlockElement.focus()
        }
      }, 0)
    }

    // Backspace on empty block - remove it
    if (e.key === 'Backspace' && block.content === '' && blocks.length > 1) {
      e.preventDefault()
      const blockIndex = blocks.findIndex(b => b.id === blockId)
      const newBlocks = blocks.filter(b => b.id !== blockId)
      setBlocks(newBlocks)

      if (blockIndex > 0) {
        setTimeout(() => {
          const prevBlock = newBlocks[blockIndex - 1]
          const prevElement = document.querySelector(`[data-block-id="${prevBlock.id}"]`) as HTMLDivElement
          if (prevElement) {
            prevElement.focus()
            // Move cursor to end
            const range = document.createRange()
            const sel = window.getSelection()
            range.selectNodeContents(prevElement)
            range.collapse(false)
            sel?.removeAllRanges()
            sel?.addRange(range)
          }
        }, 0)
      }
    }
  }

  const handleCheckboxToggle = (blockId: string) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, checked: !block.checked } : block
    )
    setBlocks(updatedBlocks)
  }

  const getBlockPlaceholder = (type: Block['type']) => {
    switch (type) {
      case 'heading1': return "Heading 1"
      case 'heading2': return "Heading 2"
      case 'heading3': return "Heading 3"
      case 'code': return "// Write your code here"
      case 'quote': return "Quote"
      case 'list': return "List item"
      case 'orderedList': return "List item"
      case 'checklist': return "To-do"
      default: return placeholder
    }
  }

  const renderBlock = (block: Block) => {
    const commonClasses = "outline-none focus:outline-none w-full"
    const isEmpty = block.content === ''

    const baseProps = {
      'data-block-id': block.id,
      contentEditable: block.type !== 'divider',
      suppressContentEditableWarning: true,
      onInput: (e: React.FormEvent<HTMLElement>) => {
        const content = (e.target as HTMLElement).textContent || ''
        handleInput(block.id, content, e as React.FormEvent<HTMLDivElement>)
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => handleKeyDown(block.id, e as React.KeyboardEvent<HTMLDivElement>),
      className: commonClasses,
      'data-placeholder': isEmpty ? getBlockPlaceholder(block.type) : undefined,
    }

    switch (block.type) {
      case 'heading1':
        return (
          <h1
            {...baseProps}
            className={`${commonClasses} text-4xl font-bold text-white mb-2 ${isEmpty ? 'empty-placeholder' : ''}`}
          >
            {block.content}
          </h1>
        )
      case 'heading2':
        return (
          <h2
            {...baseProps}
            className={`${commonClasses} text-3xl font-bold text-white mb-2 ${isEmpty ? 'empty-placeholder' : ''}`}
          >
            {block.content}
          </h2>
        )
      case 'heading3':
        return (
          <h3
            {...baseProps}
            className={`${commonClasses} text-2xl font-bold text-white mb-2 ${isEmpty ? 'empty-placeholder' : ''}`}
          >
            {block.content}
          </h3>
        )
      case 'code':
        return (
          <pre
            {...baseProps}
            className={`${commonClasses} bg-zinc-800 p-4 rounded-lg font-mono text-sm text-zinc-300 overflow-x-auto ${isEmpty ? 'empty-placeholder' : ''}`}
          >
            {block.content}
          </pre>
        )
      case 'quote':
        return (
          <blockquote
            {...baseProps}
            className={`${commonClasses} border-l-4 border-zinc-600 pl-4 italic text-zinc-400 ${isEmpty ? 'empty-placeholder' : ''}`}
          >
            {block.content}
          </blockquote>
        )
      case 'list':
        return (
          <div className="flex items-start gap-2">
            <span className="text-zinc-500 mt-1">•</span>
            <div
              {...baseProps}
              className={`${commonClasses} text-zinc-300 flex-1 ${isEmpty ? 'empty-placeholder' : ''}`}
            >
              {block.content}
            </div>
          </div>
        )
      case 'orderedList':
        const index = blocks.filter(b => b.type === 'orderedList' && blocks.indexOf(b) <= blocks.indexOf(block)).length
        return (
          <div className="flex items-start gap-2">
            <span className="text-zinc-500 mt-1">{index}.</span>
            <div
              {...baseProps}
              className={`${commonClasses} text-zinc-300 flex-1 ${isEmpty ? 'empty-placeholder' : ''}`}
            >
              {block.content}
            </div>
          </div>
        )
      case 'checklist':
        return (
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={block.checked || false}
              onChange={() => handleCheckboxToggle(block.id)}
              className="mt-1 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-white focus:ring-2 focus:ring-white"
            />
            <div
              {...baseProps}
              className={`${commonClasses} text-zinc-300 flex-1 ${block.checked ? 'line-through opacity-60' : ''} ${isEmpty ? 'empty-placeholder' : ''}`}
            >
              {block.content}
            </div>
          </div>
        )
      case 'divider':
        return <hr className="border-zinc-700 my-4" />
      default:
        return (
          <p
            {...baseProps}
            className={`${commonClasses} text-zinc-300 ${isEmpty ? 'empty-placeholder' : ''}`}
          >
            {block.content}
          </p>
        )
    }
  }

  return (
    <div className="relative">
      <div ref={editorRef} className="space-y-3">
        {blocks.map(block => (
          <div key={block.id} className="min-h-[1.5rem]">
            {renderBlock(block)}
          </div>
        ))}
      </div>

      {/* Slash Command Menu */}
      {showSlashMenu && (
        <div
          className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden w-80"
          style={{ top: slashMenuPosition.top, left: slashMenuPosition.left }}
        >
          {slashCommands.map((command, index) => (
            <button
              key={command.type}
              onClick={() => applyCommand(command.type)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                index === selectedCommandIndex ? 'bg-zinc-800' : 'hover:bg-zinc-800'
              }`}
            >
              <div className="text-zinc-400 mt-0.5">{command.icon}</div>
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{command.label}</div>
                <div className="text-zinc-500 text-xs">{command.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .empty-placeholder:empty:before {
          content: attr(data-placeholder);
          color: rgb(113 113 122);
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
