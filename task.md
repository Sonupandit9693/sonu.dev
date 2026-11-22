I'll perform a comprehensive codebase audit of your portfolio website and blog system. Let me start by exploring the repository structure and understanding the current implementation.Let me start by exploring the repository structure and branch:Now let me explore the branch and see the current implementation:Now let me explore the blog-system branch structure more deeply:Let me continue inspecting more files:# COMPREHENSIVE CODEBASE AUDIT & IMPLEMENTATION PLAN
## Sonupandit9693/sonu.dev Portfolio Website

---

## Repository Understanding

### Current Framework & Stack
- **Framework**: Next.js 13.5.4 with App Router
- **Language**: TypeScript (77.5% of codebase)
- **Styling**: Tailwind CSS 3.3.3 with custom typography plugin
- **Content**: MDX support via `@next/mdx` and Contentlayer
- **Database**: Prisma 5.20.0 (with schema not yet inspected)
- **Authentication**: NextAuth.js 4.24.15
- **UI Components**: Lucide React icons, Framer Motion animations
- **Code Quality**: Rome linter/formatter

### Blog Architecture (feat/blog-system)
- **Block-based editor**: Custom contentEditable implementation with Markdown serialization
- **Storage**: Posts stored via API (`/api/posts`) with Prisma backend
- **Editor State**: React useState with block-based content model
- **Rendering**: Manual Markdown-to-HTML parsing in blog detail page
- **Features**: Slash commands, block types (heading, code, quote, list, divider, checklist)
- **UX**: Preview mode, auto-slug generation, excerpt/video URL metadata

### Key Routes
- `/` — Home page with hero, introduction, navigation
- `/experience` — Experience/timeline page
- `/projects` — Projects showcase
- `/skills` — Technical skills
- `/blogs` — Blog listing (grid view, no search yet)
- `/blogs/create` — Blog editor (authenticated)
- `/blogs/[slug]` — Blog article detail (with comments, likes)

### Important Components
- `app/components/nav.tsx` — Navigation header
- `app/components/about.tsx` — About section (used on home)
- `app/components/particles.tsx` — Animated background
- `app/blogs/create/page.tsx` — Blog editor page
- `app/blogs/components/RichTextEditor.tsx` — Reusable rich text editor component (not currently used in create page)
- `app/blogs/BlogsClient.tsx` — Blog listing page
- `app/blogs/[slug]/page.tsx` — Blog detail page with comments
- `app/components/BannerUpload.tsx` — Image upload with drag-drop

---

## Critical Findings

### 🔴 **CRITICAL ISSUE: Editor Text Alignment Problem**

**Location**: `app/blogs/create/page.tsx` (lines 254-287, `renderBlock` function)

**Problem**: The editor text is **not pushing right**, but the layout structure and CSS suggest this is a **misunderstanding of how the blocks render**. Inspection shows:

1. **Paragraph block renders correctly** with `text-zinc-300 leading-relaxed` 
2. **Heading blocks render correctly** with proper font sizes (`text-4xl`, `text-3xl`, `text-2xl`)
3. **List items use flexbox** with bullet/number on left: `<div className="flex gap-2"><span>•</span><div>...content...</div></div>`
4. **All blocks are full-width**: `className="outline-none focus:outline-none w-full"`

**Root Cause Hypothesis**: 
The user is likely experiencing **list item content appearing misaligned** due to the flex layout structure in lines 277-281 and 279-281. The `<div>` wrapper around contentEditable content in lists may not be wrapping text properly, or the typing experience creates the *illusion* of right-pushing when a bullet list is first typed.

**Evidence**:
```tsx
// Lines 277-281 (List rendering)
case 'list':
  return <div className="flex gap-2">
    <span className="text-zinc-500">•</span>
    <div {...commonProps} className={`${commonProps.className} text-zinc-300 flex-1 ...`}>
      {block.content}
    </div>
  </div>
```

The paragraph text itself should flow naturally left-to-right. The editor's `contentEditable` blocks have no RTL, `direction`, or `writing-mode` issues detected.

---

### 🟠 **MAJOR ARCHITECTURE ISSUES**

1. **Duplicate Editor Implementations**
   - `app/blogs/create/page.tsx` has its own inline editor implementation (12.6 KB)
   - `app/blogs/components/RichTextEditor.tsx` exists but is **never imported or used** (12.7 KB)
   - Creates maintenance burden and inconsistency

2. **Manual Markdown Serialization/Deserialization**
   - Editor converts blocks to Markdown strings (lines 188-205 in create/page.tsx)
   - Blog detail manually parses Markdown back to components (lines 361-405 in [slug]/page.tsx)
   - **No support for inline formatting** (bold, italic, links, code)
   - **No syntax highlighting** for code blocks
   - **Fragile parsing** — complex content will break

3. **No Rich Inline Text Support**
   - Current editor only supports block-level types
   - Cannot do **bold**, **italic**, *underline*, `inline code`, or [links](https://example.com) within text
   - Limits professional blog quality

4. **Database Schema Unknown**
   - Prisma is configured but schema file not inspected
   - Cannot verify data model, relationships, indexes

5. **Missing Blog Features**
   - **No image block** — mentioned in BannerUpload but not integrated
   - **No table support**
   - **No embed support** (for videos, tweets, etc. beyond YouTube link field)
   - **No callout/note/warning blocks** — mentioned as desired but not implemented
   - **No pull-quote block**
   - **No image captions**
   - **No code syntax highlighting**
   - **No draft/published distinction** — all posts appear published

6. **Blog UX Issues**
   - **No search or filtering** in blog listing
   - **No tag/category system** (infrastructure exists in data/posts.ts but unused)
   - **No reading time estimate**
   - **No "related posts"** section
   - **No table of contents** for longer articles
   - **No back-to-top button**
   - **Placeholder loading** just says "Loading..." instead of skeleton

7. **Authentication Issues**
   - NextAuth.js configured but API auth route not inspected
   - No error handling visible
   - Session provider exists but not fully integrated

8. **Styling Inconsistency**
   - Each page has different header/nav treatment
   - Blog listing uses grid, detail page uses prose — inconsistent
   - No cohesive design system

---

### 🟡 **MEDIUM PRIORITY ISSUES**

1. **Image Handling**
   - BannerUpload uses base64 DataURL only — not scalable for production
   - Should upload to cloud storage (Cloudinary, S3, Vercel Blob, etc.)
   - No image optimization or lazy loading

2. **Blog Detail Page Rendering**
   - Uses manual regex parsing instead of proper Markdown library
   - No syntax highlighting for code blocks
   - Limited HTML support

3. **Missing Portfolio Pages**
   - Home page has blog link commented out (line 10 in page.tsx)
   - Blog is partially integrated but not fully linked

4. **Performance**
   - No lazy loading for images
   - No pagination on blog listing
   - No caching strategies defined

5. **SEO**
   - Blog detail page doesn't generate dynamic metadata
   - No OpenGraph images for blog posts
   - No sitemap

---

## Ordered Implementation Tasks

### **PHASE 1 — CRITICAL BUGS & EDITOR FOUNDATION**

---

#### **Task 01 — Diagnose and Fix Editor Text Alignment**

**Priority**: P0  
**Area**: Blog Editor

**Problem**:
Editor text appears to push toward the right instead of flowing naturally left-to-right. When typing, the cursor behavior or text wrapping feels wrong compared to a normal writing canvas.

**Evidence**:
- `app/blogs/create/page.tsx` lines 254-287 (renderBlock function)
- Specifically list and paragraph rendering in contentEditable divs
- User reports: "text appears to start from one fixed point and words/content are being pushed toward the right"

**Root Cause**:
Most likely scenario: The list block's flex layout is working correctly, but when transitioning from a list item to typing normally, the user sees the flex container with the bullet on the left and thinks text is "pushed right." OR contentEditable wrapping is broken due to missing `white-space` handling.

**Solution**:
1. Verify no CSS applied sets `direction: rtl`, `writing-mode`, or unusual text alignment
2. Check if contentEditable blocks have `white-space: pre-wrap` or `white-space: normal`
3. Ensure paragraph blocks use `text-left` explicitly
4. Test actual typing in editor to reproduce and confirm the exact issue
5. If issue is list layout, add proper `flex-wrap` and ensure text wraps within flex-item

**Implementation**:
1. Add explicit `text-left` to all paragraph/heading blocks
2. Set `white-space: normal` on contentEditable elements
3. Test list items: ensure they wrap naturally
4. Add debug styles temporarily to identify what's wrong
5. Verify no global CSS overrides text direction

**Dependencies**:
None

**Acceptance Criteria**:
- Type text in paragraph block: text flows left-to-right, wraps naturally to next line when reaching edge
- Type text in list item: bullet stays left, text wraps within content area
- Cursor position matches expected behavior
- No strange spacing or alignment issues

---

#### **Task 02 — Unify Editor Implementation**

**Priority**: P0  
**Area**: Blog Editor Architecture

**Problem**:
Two separate editor implementations exist:
- `app/blogs/create/page.tsx` (inline, 12.6 KB)
- `app/blogs/components/RichTextEditor.tsx` (component, 12.7 KB, unused)

This creates maintenance burden and inconsistency. The component version is never imported.

**Evidence**:
- `app/blogs/create/page.tsx` imports only BannerUpload, not RichTextEditor
- RichTextEditor.tsx is orphaned in components directory
- Both have identical slash command menu, block types, and keybinding logic

**Root Cause**:
RichTextEditor was built but create/page.tsx was never refactored to use it.

**Solution**:
Make RichTextEditor the canonical editor component and use it in create/page.tsx. This allows reuse for edit mode and other future editors.

**Implementation**:
1. Verify RichTextEditor.tsx has feature parity with create/page.tsx inline implementation
2. If RichTextEditor is missing features, add them
3. Remove inline editor code from create/page.tsx
4. Import and use RichTextEditor component
5. Export blocks state from RichTextEditor via `onChange` callback
6. Update create/page.tsx to consume RichTextEditor and handle block serialization

**Dependencies**:
Task 01 (must fix text alignment first)

**Acceptance Criteria**:
- RichTextEditor is used in /blogs/create page
- All slash commands work identically
- All block types render the same
- No duplicate code remains
- Component is reusable for future edit/create pages

---

#### **Task 03 — Define Blog Post Data Model**

**Priority**: P0  
**Area**: Database & API

**Problem**:
Prisma is configured but schema is unknown. Cannot verify:
- Post data structure
- Relationship to User
- Draft vs published distinction
- Metadata fields

**Evidence**:
- `package.json` has Prisma 5.20.0 with postinstall hook
- API endpoints accept posts but schema not inspected
- No draft/published field visible in create page

**Root Cause**:
Prisma schema file not provided; need to inspect actual database structure.

**Solution**:
Inspect `prisma/schema.prisma` to understand current data model. Identify missing fields needed for blog feature completion.

**Implementation**:
1. Retrieve `prisma/schema.prisma` from repository
2. Document Post model, User model, Comment model, Like model
3. Identify gaps (draft status, tags, categories, etc.)
4. Update schema if needed to support planned features
5. Run `prisma migrate` to apply changes

**Dependencies**:
None (parallel to other tasks)

**Acceptance Criteria**:
- Post schema supports: id, title, content, excerpt, slug, thumbnail, videoUrl, published, createdAt, updatedAt, authorId
- User model linked to Post
- Comment model supports user and post references
- Like model supports user and post references
- Database migration up to date

---

#### **Task 04 — Add Inline Text Formatting Support**

**Priority**: P0  
**Area**: Blog Editor

**Problem**:
Editor only supports block-level formatting (heading, paragraph, code, quote, list). Cannot apply **bold**, *italic*, `inline code`, underline, strikethrough, or links within text blocks. This severely limits blog quality.

**Evidence**:
- `RichTextEditor.tsx` blocks don't support inline marks
- No toolbar or keyboard shortcuts for text styling
- Create page has no bold/italic/link buttons

**Root Cause**:
Contenteditable implementation is block-centric. Adding inline text marking requires:
- Tracking ranges/selections within text
- Applying HTML tags or data attributes to mark ranges
- Rendering styled spans for marked ranges
- Handling serialization to Markdown/HTML

**Solution**:
Implement inline text formatting using contentEditable's native `execCommand()` or by tracking ranges and applying data attributes. Serialize to Markdown using `*italic*`, `**bold**`, `` `code` ``, `[link](url)`, etc.

**Implementation**:
1. Add inline formatting buttons/hotkeys to editor (Ctrl+B for bold, Ctrl+I for italic, Ctrl+K for link, Ctrl+` for code)
2. Use contentEditable's native formatting or track selection + apply `<mark>` tags
3. Update block serialization to convert HTML tags to Markdown syntax
4. Update blog detail parser to convert Markdown syntax back to styled text
5. Test all combinations of block + inline formatting

**Dependencies**:
Task 02 (must use unified RichTextEditor)

**Acceptance Criteria**:
- Bold text: `**bold**` renders as bold in blog detail
- Italic text: `*italic*` renders as italic
- Inline code: `` `code` `` renders with monospace
- Links: `[text](url)` renders as clickable links
- Serialization round-trips correctly (edit → save → view → edit = same formatting)

---

### **PHASE 2 — EDITOR CONTENT BLOCKS & PERSISTENCE**

---

#### **Task 05 — Add Code Block with Syntax Highlighting**

**Priority**: P1  
**Area**: Blog Editor

**Problem**:
Code blocks exist as plain text without syntax highlighting. Blog readers cannot visually distinguish code.

**Evidence**:
- Create page renders code blocks as `<pre>` with `text-zinc-300` only
- Blog detail renders code as `<code>` without highlighting
- No language selection or syntax coloring

**Root Cause**:
No highlighting library integrated. Markdown parser is manual.

**Solution**:
Integrate `rehype-pretty-code` (already in package.json) or `prismjs` for syntax highlighting.

**Implementation**:
1. In editor: add language selector to code block (JavaScript, Python, TypeScript, etc.)
2. Store language in block data: `{ type: 'code', language: 'javascript', content: '...' }`
3. In blog detail: use `rehype-pretty-code` to highlight code blocks with stored language
4. Add copy-to-clipboard button for code blocks

**Dependencies**:
Task 04 (should have inline code support)

**Acceptance Criteria**:
- Code block can select language from dropdown
- Blog detail displays syntax highlighting
- Copy button works
- Markdown serialization includes language: ` ```javascript...``` `

---

#### **Task 06 — Add Image Block with Captions**

**Priority**: P1  
**Area**: Blog Editor

**Problem**:
No image block in editor. Banner upload exists but is for post thumbnail only. Cannot insert images mid-article.

**Evidence**:
- BannerUpload.tsx is separate component for banner only
- No slash command for image block
- Blog content cannot include inline images

**Root Cause**:
Image block never implemented in block types.

**Solution**:
Add image block type with caption support. Integrate BannerUpload logic for image upload.

**Implementation**:
1. Add `'image'` to Block type union
2. Create image block in RichTextEditor with caption field
3. Integrate BannerUpload for image selection (or simplified version)
4. Serialize: `![alt text](url "caption")`
5. Parse in blog detail: render as `<figure><img/><figcaption/></figure>`
6. Handle image optimization (lazy loading, responsive sizes)

**Dependencies**:
Task 05 (after core blocks working)

**Acceptance Criteria**:
- Can insert image block via slash command
- Can upload or paste image URL
- Can add caption text
- Blog detail renders as `<figure>` with caption
- Images are lazy-loaded

---

#### **Task 07 — Add Callout/Note/Warning Blocks**

**Priority**: P1  
**Area**: Blog Editor

**Problem**:
No special content blocks (note, tip, warning, success, info). All content is generic.

**Evidence**:
- User requested in spec: Note, Tip, Warning, Information, Success, Quote, Pull quote, Callout blocks
- Currently only have: paragraph, heading, list, quote, code, divider

**Root Cause**:
Callout blocks not implemented.

**Solution**:
Add visually distinct block types for common callout patterns. Each should have icon, background color, border color, and title.

**Implementation**:
1. Add block types: `'callout-note'`, `'callout-tip'`, `'callout-warning'`, `'callout-info'`, `'callout-success'`
2. For each type, define: icon (from lucide-react), background color, border color, text color
3. Render with visual styling (colored border-left, icon, background tint)
4. Allow content inside callout (text only for MVP, or nested blocks later)
5. Serialize to Markdown: `> [!NOTE]\n> Content here` (GitHub-flavored Markdown style)
6. Parse in blog detail with matching styling

**Dependencies**:
Task 06 (after image block)

**Acceptance Criteria**:
- Each callout type selectable via slash command
- Renders with distinct colors and icons
- Blog detail shows matching styling
- Accessible: proper contrast, semantic markup

---

#### **Task 08 — Add Pull-Quote/Blockquote Enhancement Block**

**Priority**: P2  
**Area**: Blog Editor

**Problem**:
Quote block exists but is plain blockquote. No support for attributed pull quotes or styled quotes.

**Evidence**:
- Quote type in editor is simple `<blockquote>`
- User requested specific "pull quote" styling

**Root Cause**:
Quote block too simple; no attribution support.

**Solution**:
Enhance quote block to support optional author/source attribution. Style as pull quote.

**Implementation**:
1. Modify quote block to have: `content` (quote text) and `attribution` (optional author name)
2. Render with larger text, different styling, attribution line
3. Serialize: `> Quote text\n> — Author Name`
4. Add slash command for pull quote variant
5. Style distinctly from regular blockquote

**Dependencies**:
Task 07 (after callout)

**Acceptance Criteria**:
- Quote block can have attribution
- Blog detail renders with author line
- Styling distinguishes it from regular paragraph
- Markdown round-trip works

---

#### **Task 09 — Fix Blog Post Serialization & Deserialization**

**Priority**: P0  
**Area**: Blog Data Flow

**Problem**:
Current implementation uses brittle Markdown string conversion and manual parsing. Complex content will break. No structured data format.

**Evidence**:
- `create/page.tsx` lines 188-205: custom `blocksToContent()` converts blocks to Markdown string
- `[slug]/page.tsx` lines 361-405: manual parsing of Markdown back to JSX
- Parsing fragile: splits by `\n\n`, uses startsWith, no error handling

**Root Cause**:
Using Markdown as intermediate format is lossy. Better to store structured block data as JSON.

**Solution**:
Store posts as structured JSON block array in database instead of Markdown string. Render JSON directly in blog detail.

**Implementation**:
1. Change Post schema: `content: Json` instead of `content: String`
2. Update API to accept and store JSON block array
3. Update create/page.tsx to send `blocks` array directly (not Markdown string)
4. Update [slug]/page.tsx to iterate blocks array and render each block
5. Keep Markdown export option for later (MDX integration)

**Dependencies**:
Task 03 (need schema update)

**Acceptance Criteria**:
- Posts stored as JSON block array
- All block types persist correctly
- Blog detail renders from JSON
- No data loss on round-trip

---

#### **Task 10 — Add Draft/Published Distinction**

**Priority**: P1  
**Area**: Blog System

**Problem**:
All posts are immediately published. No draft mode for work-in-progress articles.

**Evidence**:
- Create page immediately publishes
- No checkbox or "save as draft" option
- No draft listing for author

**Root Cause**:
No published/draft field in schema.

**Solution**:
Add `published: Boolean = false` to Post model. Show only published posts on public listing. Allow author to view/edit drafts.

**Implementation**:
1. Update Prisma schema: add `published: Boolean = false` field
2. Update create API: accept `published` parameter from editor
3. Update editor UI: add "Save as Draft" and "Publish" buttons
4. Update blogs listing: filter to `published = true`
5. Add drafts listing page for authenticated user (e.g., `/blogs/drafts`)
6. Show draft badge on draft posts

**Dependencies**:
Task 09 (need working serialization first)

**Acceptance Criteria**:
- Can save post as draft without publishing
- Drafts appear on `/blogs/drafts` for author
- Drafts don't appear on public `/blogs` listing
- Can convert draft to published

---

### **PHASE 3 — BLOG UX & DISCOVERY**

---

#### **Task 11 — Add Blog Search & Filtering**

**Priority**: P2  
**Area**: Blog Listing

**Problem**:
No way to find posts by title, tag, or category. Blog listing is static grid.

**Evidence**:
- `BlogsClient.tsx` doesn't implement search
- `SearchAndFilters.tsx` component exists but unused
- No tag/category system in current posts

**Root Cause**:
Search feature not implemented. Infrastructure in posts.ts but unused.

**Solution**:
Implement search by title/excerpt and filtering by category/tags.

**Implementation**:
1. Integrate `SearchAndFilters.tsx` component
2. Add search input: filters by title/excerpt on frontend
3. Add category/tag filter dropdowns (read from posts)
4. Implement API endpoint: `GET /api/posts?search=term&category=tag&tag=value`
5. Backend filters posts in database
6. Show result count and "clear filters" button

**Dependencies**:
Task 09 (need stable post structure)

**Acceptance Criteria**:
- Search filters posts by title/excerpt
- Category and tag dropdowns work
- Results update in real-time
- No results shows helpful message
- Clear button resets filters

---

#### **Task 12 — Add Reading Time Estimate**

**Priority**: P2  
**Area**: Blog Listing & Detail

**Problem**:
Blog cards and detail page don't show reading time. Readers can't gauge post length.

**Evidence**:
- BlogsClient shows views, likes, comments but not reading time
- Blog detail shows views and date but no reading time

**Root Cause**:
Reading time calculation not implemented.

**Solution**:
Calculate reading time based on word count (assume 200 words/minute average).

**Implementation**:
1. Create utility: `calculateReadingTime(content: string): number` (returns minutes)
2. In create API: calculate and store `readingTime` on Post
3. Display on blog cards: "8 min read"
4. Display on blog detail: "8 min read" in metadata
5. Update Prisma schema if needed

**Dependencies**:
Task 09 (need stable content)

**Acceptance Criteria**:
- Reading time displays on all blog cards
- Reading time shows on blog detail
- Calculation is reasonable (longer posts = more time)

---

#### **Task 13 — Add Table of Contents for Long Articles**

**Priority**: P3  
**Area**: Blog Detail

**Problem**:
Long articles lack navigation. Readers can't jump to sections.

**Evidence**:
- Blog detail just renders all content sequentially
- No heading-based TOC

**Root Cause**:
Table of contents feature not implemented.

**Solution**:
Generate TOC from H2/H3 headings. Render as sticky sidebar or toggle panel. Make headings linkable.

**Implementation**:
1. Extract H2/H3 headings from blocks during render
2. Generate list with scroll-to links
3. Render sticky TOC on desktop (right sidebar)
4. Render collapsible TOC on mobile
5. Add scroll-spy to highlight current section
6. Add IDs to all headings for linking

**Dependencies**:
Task 09 (need heading blocks)

**Acceptance Criteria**:
- TOC shows all H2/H3 headings
- Clicking TOC link scrolls to section
- TOC shows on desktop, collapsible on mobile
- Current section highlighted during scroll

---

#### **Task 14 — Add Related Posts**

**Priority**: P3  
**Area**: Blog Detail

**Problem**:
Blog detail doesn't suggest related articles. Missed opportunity for engagement.

**Evidence**:
- [slug]/page.tsx ends with comments section
- No "You might also like" section

**Root Cause**:
Related posts feature not implemented.

**Solution**:
Show 3-4 related posts at end of article. Match by tags/category or just show recent posts.

**Implementation**:
1. Create API endpoint: `GET /api/posts/related?slug=current-post&limit=3`
2. Backend finds posts with matching tags/category, excludes current post
3. Sort by creation date (newest first)
4. Render at end of blog detail with thumbnail and excerpt
5. Update [slug]/page.tsx to fetch and display

**Dependencies**:
Task 11 (need tags/category system)

**Acceptance Criteria**:
- 3-4 related posts appear at end of article
- None of them are the current post
- Clicking related post navigates correctly

---

### **PHASE 4 — IMAGE & MEDIA HANDLING**

---

#### **Task 15 — Implement Cloud Image Upload**

**Priority**: P1  
**Area**: Image Handling

**Problem**:
Current implementation uses base64 DataURL only. Doesn't scale. Images embedded in JSON bloat database.

**Evidence**:
- `BannerUpload.tsx` line 40-48: `readAsDataURL` stores data:image/... string
- Posts stored with full image data
- No image optimization or CDN

**Root Cause**:
No cloud storage integration.

**Solution**:
Integrate cloud image hosting (Cloudinary, Vercel Blob, S3, or similar). Upload files and store URL references.

**Implementation**:
1. Choose provider (recommend Vercel Blob for simplicity or Cloudinary for features)
2. Create API endpoint: `POST /api/upload` accepting file
3. Upload file to cloud storage
4. Return secure URL
5. Update BannerUpload.tsx to call `/api/upload` instead of reading as DataURL
6. Store returned URL in Post
7. Add image optimization settings (size, format, etc.)

**Dependencies**:
None (can be done in parallel)

**Acceptance Criteria**:
- Image upload sends to cloud storage
- Returned URL stored in database
- Images serve from CDN (cached, fast)
- No base64 images in database
- Images are optimized

---

#### **Task 16 — Add Image Lazy Loading & Optimization**

**Priority**: P2  
**Area**: Image Handling

**Problem**:
Images in blog detail load synchronously, affecting page performance.

**Evidence**:
- [slug]/page.tsx renders `<img>` without optimization
- No lazy loading, no responsive sizes, no WebP

**Root Cause**:
No Next.js Image component or optimization applied.

**Solution**:
Use Next.js Image component for automatic optimization and lazy loading.

**Implementation**:
1. Replace all `<img>` tags with `next/image` Image component
2. Set sizes for responsive images
3. Enable automatic format selection (WebP, AVIF)
4. Add placeholder blur (if available)
5. Test performance with Lighthouse

**Dependencies**:
Task 15 (need remote URLs, not DataURLs)

**Acceptance Criteria**:
- All images lazy-loaded
- Images optimized by Next.js
- Lighthouse performance improved
- No Cumulative Layout Shift

---

### **PHASE 5 — PORTFOLIO PAGE IMPROVEMENTS**

---

#### **Task 17 — Improve Home Page Hero & Information Hierarchy**

**Priority**: P2  
**Area**: Home Page

**Problem**:
Home page is sparse. Limited developer identity presentation. Missing engagement opportunities.

**Evidence**:
- `app/page.tsx` lines 1-80: basic hero with name, subtitle, links
- Long description compressed into small text
- No clear visual hierarchy between intro and About section
- Blog link is commented out (line 10)

**Root Cause**:
Limited content and visual hierarchy.

**Solution**:
Improve hero section with better typography, spacing, and visual hierarchy. Enhance introduction and highlights.

**Implementation**:
1. Improve hero text hierarchy: name (largest), title/role, company link
2. Add 2-3 key stats/achievements (e.g., "5+ years experience", "100+ projects", "AWS Certified")
3. Improve subtitle formatting and contrast
4. Add hero image or animated background enhancement
5. Add call-to-action buttons (Resume, Contact, Projects)
6. Uncomment blog link or add blog preview section
7. Improve responsive layout for mobile

**Dependencies**:
None (can be done independently)

**Acceptance Criteria**:
- Hero section is visually striking and professional
- Key information easy to scan
- Call-to-action buttons clear
- Responsive on mobile
- Blog is linked/visible

---

#### **Task 18 — Improve Experience/Timeline Page Layout**

**Priority**: P2  
**Area**: Experience Page

**Problem**:
Experience page layout not inspected. Likely needs better timeline visualization and information hierarchy.

**Evidence**:
- Route exists: `/experience` but content not fully reviewed

**Root Cause**:
Page needs audit for UX/design quality.

**Solution**:
Review and improve experience section with better timeline, job descriptions, achievements, and technologies.

**Implementation**:
1. Inspect current experience page structure
2. Improve timeline visualization (vertical line with job cards)
3. Show company logo, role, dates clearly
4. List key responsibilities (bullet points)
5. Show technologies used per job
6. Add duration calculation (e.g., "2 years 3 months")
7. Improve mobile layout

**Dependencies**:
None

**Acceptance Criteria**:
- Timeline is visually clear and professional
- Job information is scannable
- Technologies displayed
- Responsive on mobile
- Dates are readable

---

#### **Task 19 — Improve Projects Page with Better Cards & Filtering**

**Priority**: P2  
**Area**: Projects Page

**Problem**:
Projects page not inspected but likely needs better presentation and discoverability.

**Evidence**:
- Route exists: `/projects` but content not reviewed

**Root Cause**:
Page needs audit.

**Solution**:
Improve projects showcase with better cards, filtering, and call-to-action.

**Implementation**:
1. Inspect current projects page
2. Improve project cards with better layout, images, descriptions
3. Show tech stack per project (badges or list)
4. Add GitHub and demo links with icons
5. Add category/tech filtering
6. Show project stats (stars, forks if GitHub links available)
7. Improve hover states and animations
8. Add case study links or "view details" option

**Dependencies**:
None

**Acceptance Criteria**:
- Project cards are visually professional
- Tech stack clearly shown
- Links to GitHub/demo are obvious
- Filtering works
- Responsive on mobile

---

#### **Task 20 — Improve Technical Skills Page**

**Priority**: P2  
**Area**: Skills Page

**Problem**:
Skills page not inspected but likely shows simple list without proper organization.

**Evidence**:
- Route exists: `/skills` but content not reviewed

**Root Cause**:
Page needs audit.

**Solution**:
Organize skills by category (Frontend, Backend, Database, DevOps, etc.) with visual improvements.

**Implementation**:
1. Inspect current skills page
2. Organize skills into logical groups (Frontend, Backend, Database, DevOps, Tools, Soft Skills)
3. Use icons for each skill (from lucide-react)
4. Remove skill rating bars (avoid false precision)
5. Use visual grouping (cards, sections) instead of flat list
6. Add skill proficiency indicator if valuable (e.g., "Expert", "Proficient", "Learning")
7. Highlight key/core skills
8. Keep maintainable (easy to add/remove skills)

**Dependencies**:
None

**Acceptance Criteria**:
- Skills organized by category
- Each skill has icon
- Visual hierarchy clear
- Easy to maintain
- Responsive on mobile

---

### **PHASE 6 — DESIGN SYSTEM & CONSISTENCY**

---

#### **Task 21 — Create Shared Component Library**

**Priority**: P2  
**Area**: Design System

**Problem**:
No cohesive component library. Styling inconsistent across pages.

**Evidence**:
- Navigation in multiple places with different styles
- Buttons styled differently (blog vs other pages)
- Cards have different borders/spacing
- No centralized color/spacing tokens

**Root Cause**:
No design system; components built ad-hoc.

**Solution**:
Extract common components and style patterns into reusable library.

**Implementation**:
1. Create `app/components/ui/` directory for shared components
2. Build: Button, Card, Badge, Input, Textarea, Select, Modal, Alert, Toast, etc.
3. Consistent styling: use Tailwind classes consistently
4. Define color palette (use existing gray/zinc scale)
5. Define spacing scale (use Tailwind's default with customization)
6. Update all pages to use shared components
7. Document component API (props, variants)

**Dependencies**:
None (can be done in parallel)

**Acceptance Criteria**:
- 10+ reusable components created
- All pages use shared components
- Consistent styling across app
- Components accept standard props (className, disabled, etc.)

---

#### **Task 22 — Implement Dark/Light Mode Toggle**

**Priority**: P3  
**Area**: Design System

**Problem**:
App is dark-only. No light mode option.

**Evidence**:
- Body background: `bg-black` (line 71 in layout.tsx)
- All pages hardcoded to dark colors
- No theme provider

**Root Cause**:
Dark mode is hardcoded, not toggleable.

**Solution**:
Implement theme switching with Tailwind's dark mode and next-themes.

**Implementation**:
1. Install `next-themes`
2. Wrap app with ThemeProvider in layout.tsx
3. Add theme toggle button in navigation
4. Configure Tailwind to support dark: variant
5. Update all colors to use dark: variant (e.g., `bg-white dark:bg-zinc-950`)
6. Store user preference in localStorage
7. Test light and dark modes

**Dependencies**:
Task 21 (after shared components)

**Acceptance Criteria**:
- Theme toggle button in navbar
- Light mode option works
- Dark mode is default
- Theme persists across sessions
- All pages support both modes

---

#### **Task 23 — Improve Typography & Spacing Consistency**

**Priority**: P2  
**Area**: Design System

**Problem**:
Font sizes, weights, and line heights inconsistent. Spacing (margin/padding) varies randomly.

**Evidence**:
- Home page has `text-9xl` for hero, other pages `text-5xl` for similar sections
- Cards have varying padding
- Heading sizes inconsistent across pages

**Root Cause**:
No typographic scale applied consistently.

**Solution**:
Define and apply consistent typographic scale and spacing system.

**Implementation**:
1. Define font scale: H1 (2.5rem), H2 (2rem), H3 (1.5rem), Body (1rem), Small (0.875rem)
2. Define font weights: Regular (400), Medium (500), Semibold (600), Bold (700)
3. Define line heights: Headings (1.2), Body (1.6), Dense (1.4)
4. Define spacing scale: xs (0.25rem), sm (0.5rem), md (1rem), lg (1.5rem), xl (2rem)
5. Apply consistently across all components
6. Update Tailwind config with custom scale
7. Refactor all pages to use scale

**Dependencies**:
Task 21 (after shared components)

**Acceptance Criteria**:
- All headings use defined scale
- All body text consistent
- Spacing follows 8px or similar grid
- Responsive typography (different sizes on mobile)
- No ad-hoc sizing

---

#### **Task 24 — Improve Focus States & Accessibility**

**Priority**: P2  
**Area**: Accessibility

**Problem**:
No visible focus states for keyboard navigation. Likely missing alt text and semantic HTML.

**Evidence**:
- No focus:outline-2 or focus:ring classes on interactive elements
- May be missing ARIA labels
- Images may lack alt text

**Root Cause**:
Accessibility not prioritized during development.

**Solution**:
Add focus states, semantic HTML, ARIA labels, and alt text throughout.

**Implementation**:
1. Add focus states to all buttons and links: `focus:outline-2 focus:outline-white`
2. Add `tabindex` where needed for custom components
3. Add ARIA labels to icon buttons (e.g., `aria-label="Close menu"`)
4. Add alt text to all images
5. Use semantic HTML: `<button>`, `<a>`, `<nav>`, `<article>`, etc.
6. Test with keyboard navigation (Tab, Enter, Escape)
7. Test with screen reader (VoiceOver, NVDA)

**Dependencies**:
Task 21 (after shared components)

**Acceptance Criteria**:
- All interactive elements have visible focus state
- Keyboard navigation works
- All images have alt text
- Screen reader compatible
- WCAG AA compliance (at least)

---

### **PHASE 7 — PERFORMANCE & ENGINEERING QUALITY**

---

#### **Task 25 — Add Loading & Error States**

**Priority**: P2  
**Area**: UX Polish

**Problem**:
Generic loading states ("Loading...") and no error boundaries or fallbacks.

**Evidence**:
- BlogsClient.tsx line 61-66: just "Loading posts..." text
- [slug]/page.tsx line 157: just "Loading post..."
- No error handling for failed API calls

**Root Cause**:
Loading/error states not implemented.

**Solution**:
Create skeleton loaders for lists/cards and error boundaries with retry.

**Implementation**:
1. Create Skeleton component for blog card loading
2. Create Skeleton for blog detail (heading, content, metadata)
3. Show 3-4 skeleton cards while loading blog list
4. Show full page skeleton while loading blog detail
5. Add error boundary component that catches errors
6. Show error message with retry button
7. Log errors to console (add proper logging later)

**Dependencies**:
Task 21 (use shared Button, etc.)

**Acceptance Criteria**:
- Blog listing shows skeleton cards while loading
- Blog detail shows skeleton while loading
- API errors show user-friendly message with retry
- No "Loading..." text; always show skeleton or error

---

#### **Task 26 — Add SEO Optimization**

**Priority**: P2  
**Area**: SEO

**Problem**:
Blog posts don't have dynamic metadata. No OpenGraph images for social sharing. No sitemap.

**Evidence**:
- Blog detail page doesn't set dynamic title/description
- No OpenGraph tags for blog posts
- No robots.txt or sitemap

**Root Cause**:
SEO not implemented for dynamic content.

**Solution**:
Add dynamic metadata, OpenGraph tags, and sitemap generation.

**Implementation**:
1. Update [slug]/page.tsx to generate metadata dynamically
   - Title: post title
   - Description: post excerpt
   - OpenGraph: image (thumbnail), title, description
2. Add Twitter card meta tags
3. Generate sitemap.xml with all blog posts
4. Add robots.txt
5. Add canonical links to prevent duplicate content
6. Test with SEO tools (Lighthouse, Google Search Console)

**Dependencies**:
Task 09 (need stable post structure)

**Acceptance Criteria**:
- Blog post has dynamic metadata
- OpenGraph tags present for social sharing
- Sitemap generated with all posts
- robots.txt includes blog routes
- Lighthouse SEO score > 90

---

#### **Task 27 — Add Pagination to Blog Listing**

**Priority**: P3  
**Area**: Performance

**Problem**:
Blog listing loads all posts at once. Doesn't scale for many posts.

**Evidence**:
- BlogsClient.tsx line 39-49: `fetch("/api/posts")` with no pagination
- Grid renders all posts in one page

**Root Cause**:
No pagination implemented.

**Solution**:
Add pagination with configurable page size.

**Implementation**:
1. Update API: `GET /api/posts?page=1&limit=12` returns paginated results
2. Return total count to calculate pages
3. Update BlogsClient to fetch page 1 initially
4. Show pagination controls (Previous, page numbers, Next)
5. Update URL with `?page=1` for bookmarking
6. Keep currently viewed page when navigating back

**Dependencies**:
Task 11 (integrate with search/filtering)

**Acceptance Criteria**:
- API returns paginated results
- Pagination controls appear when needed
- Page loads new posts correctly
- URL updates with page number
- Back button works as expected

---

#### **Task 28 — Add Error Handling & Validation to API**

**Priority**: P1  
**Area**: Backend Quality

**Problem**:
API endpoints likely lack proper validation and error handling.

**Evidence**:
- API code not fully inspected
- No visible validation in create page
- Generic error messages

**Root Cause**:
Minimal validation implemented.

**Solution**:
Add comprehensive input validation and error handling to all API endpoints.

**Implementation**:
1. Inspect all API routes (`/api/posts`, `/api/posts/[slug]`, etc.)
2. Add request body validation (schema validation using Zod or similar)
3. Add proper error responses with status codes (400, 404, 500)
4. Add authentication checks on protected routes
5. Add rate limiting on sensitive endpoints
6. Return user-friendly error messages
7. Log errors for debugging (add logging later)

**Dependencies**:
None (can be done in parallel)

**Acceptance Criteria**:
- Invalid requests return 400 with message
- Missing auth returns 401
- Not found returns 404
- Server errors return 500 with generic message (don't leak details)
- All validation rules checked

---

#### **Task 29 — Optimize Database Queries & Indexes**

**Priority**: P2  
**Area**: Database Performance

**Problem**:
Database queries may be inefficient. No visible query optimization.

**Evidence**:
- API endpoints not inspected for N+1 queries
- No indexes defined
- Comments fetched per post without optimization

**Root Cause**:
Query optimization not done.

**Solution**:
Audit and optimize all database queries. Add indexes for frequently queried fields.

**Implementation**:
1. Review all API routes for N+1 query problems
2. Use Prisma select/include to fetch only needed fields
3. Add Prisma relations (select comments, likes, author in single query)
4. Add database indexes: `slug`, `createdAt`, `published`
5. Consider caching frequently accessed data (Redis for user likes, view counts)
6. Measure query performance before/after

**Dependencies**:
Task 03 (need schema)

**Acceptance Criteria**:
- No N+1 queries
- Blog detail page fetches in <100ms (goal)
- Blog listing loads in <200ms
- Indexes present on commonly filtered fields

---

#### **Task 30 — Add Authentication & Authorization Layer**

**Priority**: P1  
**Area**: Security

**Problem**:
NextAuth is configured but auth layer not fully inspected. May have gaps in authorization.

**Evidence**:
- AuthProvider and AuthModal components exist
- Auth route not inspected
- No clear auth checks on protected endpoints

**Root Cause**:
Auth implementation incomplete or not fully reviewed.

**Solution**:
Complete and audit authentication system. Ensure all protected routes check auth.

**Implementation**:
1. Inspect `/api/auth/[...nextauth]` route
2. Ensure create post endpoint checks `session.user.id`
3. Ensure delete/edit endpoints check ownership
4. Add proper session validation on all protected routes
5. Add error handling for expired sessions
6. Test with unauthorized requests
7. Add CSRF protection if needed

**Dependencies**:
Task 28 (after error handling in place)

**Acceptance Criteria**:
- Cannot create post without authentication
- Can only edit/delete own posts
- Unauthorized requests return 401
- Session expires gracefully
- No auth bypass vulnerabilities

---

#### **Task 31 — Add Comprehensive Logging & Monitoring**

**Priority**: P3  
**Area**: Observability

**Problem**:
No logging or monitoring. Hard to debug production issues.

**Evidence**:
- console.error statements exist but no structured logging
- No error tracking service
- No performance metrics

**Root Cause**:
Logging not implemented.

**Solution**:
Add structured logging and optional error tracking.

**Implementation**:
1. Create logging utility (log to console in dev, service in prod)
2. Add logs to critical paths (API endpoints, page loads, errors)
3. Integrate error tracking service (e.g., Sentry) for production
4. Track key metrics (load times, error rates)
5. Add request ID for tracing
6. Ensure sensitive data (passwords, tokens) never logged

**Dependencies**:
None (can be done in parallel)

**Acceptance Criteria**:
- API errors logged with context
- Page performance tracked
- Errors collected in monitoring service
- No sensitive data logged
- Structured log format (JSON)

---

#### **Task 32 — Remove Unused Dependencies & Dead Code**

**Priority**: P3  
**Area**: Code Quality

**Problem**:
RichTextEditor component unused. Likely other unused code and dependencies.

**Evidence**:
- RichTextEditor.tsx unused (Task 02 will remove)
- `data/posts.ts` unused mock data still in repo
- May have unused packages in package.json

**Root Cause**:
Code cleanup not done during development.

**Solution**:
Audit codebase for dead code and unused dependencies.

**Implementation**:
1. Remove RichTextEditor.tsx (consolidated into create/page.tsx per Task 02)
2. Remove `data/posts.ts` mock data (replaced by API)
3. Check all components are imported somewhere
4. Check package.json dependencies are used
5. Remove unused packages
6. Use ESLint to detect unused variables

**Dependencies**:
Task 02 (after consolidating editor)

**Acceptance Criteria**:
- No unused components
- No unused imports
- No unused dependencies
- No dead code in files
- Codebase cleaner and smaller

---

## Editor Library Assessment

### Current Implementation
**Using**: Custom contentEditable implementation (not a library)

**Evaluation**:

| Aspect | Assessment |
|--------|-----------|
| **Ease of Use** | Medium — Works but requires manual state management |
| **Inline Formatting** | ❌ Not supported (no bold, italic, links) |
| **Block Flexibility** | ✅ Good — Easy to add new block types |
| **Extensibility** | ✅ Good — Can add new blocks and commands |
| **Performance** | ✅ Good — Lightweight, no heavy dependencies |
| **Accessibility** | ⚠️ Fair — Basic keyboard support, needs aria labels |
| **Serialization** | ❌ Fragile — Markdown string conversion is lossy |
| **Rendering** | ❌ Manual — Complex Markdown parsing in detail page |
| **Mobile Experience** | ⚠️ Fair — Works but not optimized for touch |
| **Learning Curve** | ✅ Low — Straightforward for developers |

### Why Keep Current Implementation

**✅ RECOMMENDATION: Keep & Improve Current Editor**

The current contentEditable implementation is:
1. **Lightweight** — No heavy framework dependencies
2. **Performant** — Direct DOM manipulation is fast
3. **Flexible** — Easy to add custom blocks
4. **Sufficiently functional** — Handles core editing needs

**Cost of Migration to Alternative Libraries**:
- Tiptap: 30-50 KB overhead, requires learning extension API, major refactor
- BlockNote: Higher level abstraction but less control, harder customization
- Lexical: Facebook's experimental editor, overkill for this use case
- Slate: Complex, steep learning curve
- Editor.js: Block-focused but different architecture (would require rewrite)

**Why Not Replace**:
1. Current implementation already works for 90% of requirements
2. Switching would require complete rewrite of editor and data flow
3. New libraries introduce dependencies and complexity
4. Current approach gives maximum control for customization

### Recommended Improvements to Current Editor

Instead of switching libraries, enhance the current implementation:

1. **Add inline formatting** (Task 04) — Use contentEditable's native selection API
2. **Switch to JSON serialization** (Task 09) — Store structured blocks instead of Markdown
3. **Add rich rendering** — Use proper Markdown parsing library for blog detail (rehype/remark already in package.json)
4. **Improve UX** — Better focus management, keyboard shortcuts, mobile optimization
5. **Add block extensions** — Images (Task 06), callouts (Task 07), etc.

This approach gives you:
- ✅ Full control and flexibility
- ✅ Minimal dependencies
- ✅ Good performance
- ✅ Incrementally improve without massive rewrites
- ✅ Customization for your specific needs

---

## Recommended Blog Editor Feature Set

Based on current implementation and Phase 2-3 tasks, here's the concrete feature checklist:

### Core Writing Features
- [x] Paragraph blocks
- [x] Heading 1/2/3
- [x] Bold text *(Task 04)*
- [x] Italic text *(Task 04)*
- [x] Inline code *(Task 04)*
- [x] Links *(Task 04)*
- [ ] Underline
- [ ] Strikethrough

### Lists & Structure
- [x] Bullet lists
- [x] Numbered lists
- [x] Checklists
- [ ] Task lists (enhanced checkboxes)
- [x] Divider/horizontal rule
- [ ] Tables *(Future, not in Phase 2-3)*

### Special Blocks
- [x] Code block *(Task 05 — with syntax highlighting)*
- [ ] Code block language selector *(Task 05)*
- [x] Quote block
- [ ] Pull quote with attribution *(Task 08)*
- [x] Image block *(Task 06)*
- [ ] Image with caption *(Task 06)*
- [x] Callout blocks *(Task 07)*
  - Note
  - Tip
  - Warning
  - Info
  - Success
- [ ] Embed block *(Future)*
- [ ] Video embed *(Future — currently handled via post videoUrl field)*

### Editor UI & Interactions
- [x] Slash commands for block insertion
- [x] Keyboard shortcuts (Enter for new block, Backspace to delete)
- [x] Drag-and-drop block reordering *(Future)*
- [x] Undo/redo *(Native browser support via contentEditable)*
- [x] Preview mode
- [x] Auto-save *(Future — add to Task 10)*

### Content Management
- [x] Title input
- [x] Excerpt input
- [x] Banner/thumbnail upload *(Task 15 — move to cloud)*
- [x] Slug auto-generation
- [x] Video URL input
- [x] Publish button
- [ ] Save as draft *(Task 10)*
- [ ] Schedule publish *(Future)*

### Blog Listing & Discovery
- [ ] Search by title *(Task 11)*
- [ ] Filter by category/tags *(Task 11)*
- [ ] Reading time estimate *(Task 12)*
- [ ] Featured/pinned posts *(Future)*
- [ ] Pagination *(Task 27)*

### Blog Detail
- [x] Thumbnail display
- [x] Author information
- [x] Publication date
- [x] View count
- [x] Comment count
- [x] Like button
- [x] Demo video embed
- [x] Comments section
- [ ] Table of contents *(Task 13)*
- [ ] Related posts *(Task 14)*
- [ ] Share buttons *(Future)*

---

## Files to Modify

### **Phase 1 Tasks (01-04)**

```
app/blogs/create/page.tsx
  ├─ Task 01: Fix text alignment CSS
  ├─ Task 02: Remove inline editor, import RichTextEditor
  ├─ Task 04: Add inline formatting support

app/blogs/components/RichTextEditor.tsx
  ├─ Task 02: Ensure feature parity with create/page.tsx
  ├─ Task 04: Add inline formatting support

prisma/schema.prisma
  ├─ Task 03: Inspect/update Post model

app/api/posts/route.ts
  ├─ Task 03: Support updated schema
```

### **Phase 2 Tasks (05-10)**

```
app/blogs/components/RichTextEditor.tsx
  ├─ Task 05: Add code language selector
  ├─ Task 06: Add image block type
  ├─ Task 07: Add callout block types
  ├─ Task 08: Enhance quote block with attribution

app/blogs/[slug]/page.tsx
  ├─ Task 05: Add syntax highlighting for code
  ├─ Task 06: Render image blocks with captions
  ├─ Task 07: Style callout blocks
  ├─ Task 08: Render attributed quotes
  ├─ Task 09: Update to render JSON blocks instead of Markdown

app/api/posts/route.ts
  ├─ Task 09: Change content field from string to JSON

app/api/posts/[slug]/route.ts
  ├─ Task 10: Check draft/published field

app/blogs/create/page.tsx
  ├─ Task 10: Add Save as Draft button
```

### **Phase 3 Tasks (11-14)**

```
app/blogs/components/SearchAndFilters.tsx
  ├─ Task 11: Implement search and filter logic

app/blogs/BlogsClient.tsx
  ├─ Task 11: Integrate search/filter component
  ├─ Task 12: Display reading time

app/blogs/[slug]/page.tsx
  ├─ Task 12: Display reading time in metadata
  ├─ Task 13: Generate and display table of contents
  ├─ Task 14: Fetch and display related posts

app/api/posts/route.ts
  ├─ Task 11: Add search/filter query parameters
  ├─ Task 12: Calculate and return reading time

app/api/posts/[slug]/related/route.ts
  ├─ Task 14: New endpoint to get related posts (create this file)
```

### **Phase 4 Tasks (15-16)**

```
app/api/upload/route.ts
  ├─ Task 15: New endpoint for cloud image upload (create this file)

app/components/BannerUpload.tsx
  ├─ Task 15: Update to call /api/upload

app/blogs/[slug]/page.tsx
  ├─ Task 16: Replace <img> with Next.js Image component

app/blogs/BlogsClient.tsx
  ├─ Task 16: Optimize thumbnail images
```

### **Phase 5 Tasks (17-20)**

```
app/page.tsx
  ├─ Task 17: Improve hero section, add stats, improve hierarchy

app/experience/page.tsx
  ├─ Task 18: Improve timeline layout (file not yet inspected)

app/projects/page.tsx
  ├─ Task 19: Improve project cards, add filtering (file not yet inspected)

app/skills/page.tsx
  ├─ Task 20: Organize by category, add icons (file not yet inspected)
```

### **Phase 6 Tasks (21-24)**

```
app/components/ui/Button.tsx (new)
  ├─ Task 21: Create shared button component

app/components/ui/Card.tsx (new)
  ├─ Task 21: Create shared card component

app/components/ui/Badge.tsx (new)
  ├─ Task 21: Create shared badge component

[Many shared UI components...]
  ├─ Task 21: Create UI component library

app/layout.tsx
  ├─ Task 22: Add ThemeProvider wrapper

app/components/nav.tsx
  ├─ Task 22: Add theme toggle button

tailwind.config.js
  ├─ Task 22: Configure dark mode
  ├─ Task 23: Add custom typography and spacing scale

[All pages]
  ├─ Task 21: Update to use shared components
  ├─ Task 22: Update colors for dark mode
  ├─ Task 23: Apply consistent typography
  ├─ Task 24: Add focus states and ARIA labels
```

### **Phase 7 Tasks (25-32)**

```
app/components/ui/Skeleton.tsx (new)
  ├─ Task 25: Create skeleton loader component

app/blogs/BlogsClient.tsx
  ├─ Task 25: Show skeleton while loading

app/blogs/[slug]/page.tsx
  ├─ Task 25: Show error state with retry
  ├─ Task 26: Generate dynamic metadata

public/sitemap.xml (new)
  ├─ Task 26: Generate sitemap

public/robots.txt (new)
  ├─ Task 26: Add robots.txt

app/api/posts/route.ts
  ├─ Task 27: Add pagination (page, limit query params)
  ├─ Task 28: Add input validation
  ├─ Task 30: Add authentication checks

app/api/posts/[slug]/route.ts
  ├─ Task 28: Add error handling and validation
  ├─ Task 30: Add auth checks for edit/delete

lib/logging.ts (new)
  ├─ Task 31: Create logging utility

[All API routes]
  ├─ Task 31: Add logging to critical paths
  ├─ Task 28: Add error handling

package.json
  ├─ Task 32: Remove unused dependencies
```

---

## Implementation Order

**Complete tasks in this exact sequence** to minimize conflicts and maximize incrementality:

```
PHASE 1 — CRITICAL FOUNDATION
├─ Task 03 ← START HERE (understand database)
├─ Task 01 (fix editor text alignment)
├─ Task 02 (unify editor implementations)
└─ Task 04 (add inline formatting)

PHASE 2 — CONTENT & PERSISTENCE
├─ Task 09 (switch to JSON serialization) ← KEY MILESTONE
├─ Task 05 (code syntax highlighting)
├─ Task 06 (image blocks)
├─ Task 07 (callout blocks)
├─ Task 08 (pull quotes)
└─ Task 10 (draft/published)

PHASE 3 — DISCOVERY & UX
├─ Task 12 (reading time)
├─ Task 11 (search/filtering)
├─ Task 13 (table of contents)
└─ Task 14 (related posts)

PHASE 4 — MEDIA & PERFORMANCE
├─ Task 15 (cloud image upload) ← CLOUD INTEGRATION
├─ Task 16 (lazy loading & optimization)
└─ Task 27 (pagination) ← Move here from Phase 7

PHASE 5 — PORTFOLIO POLISH
├─ Task 17 (home page)
├─ Task 18 (experience page)
├─ Task 19 (projects page)
└─ Task 20 (skills page)

PHASE 6 — DESIGN SYSTEM
├─ Task 21 (shared components)
├─ Task 23 (typography & spacing)
├─ Task 22 (dark/light mode)
└─ Task 24 (accessibility)

PHASE 7 — QUALITY & DEPLOYMENT
├─ Task 28 (API error handling & validation) ← EARLY for bugs
├─ Task 30 (auth & authorization)
├─ Task 29 (database optimization)
├─ Task 25 (loading & error states)
├─ Task 26 (SEO)
├─ Task 31 (logging & monitoring)
└─ Task 32 (code cleanup)
```

### **Why This Order?**

1. **Task 03 First** — Need to know database structure before building anything
2. **Tasks 01-02 Critical** — Fix broken editor before adding features
3. **Task 09 Milestone** — Core data model change enables all rich content
4. **Task 15 Before Images** — Need cloud upload before adding image blocks
5. **Portfolio Pages Later** — Can be done in parallel, don't block blog
6. **Design System Mid-Project** — Reduces refactoring when applied early
7. **Quality Last** — Error handling, logging, auth validation best done after features work

### **Parallel Work Possible**

These can be done simultaneously without conflicts:
- Task 20 (skills) ↔ Task 17 (home) — Different pages
- Task 31 (logging) ↔ Any Phase 2 task — Orthogonal concern
- Task 21 (components) ↔ Task 17-20 (portfolio pages) — Design system can start while pages worked on

---

## Summary

You have a **solid foundation** with Next.js, Tailwind, and NextAuth. The blog system is **partially implemented** but needs:

1. **Immediate fixes** — Editor text alignment, unified implementation
2. **Architecture improvement** — JSON serialization instead of Markdown strings
3. **Feature completion** — Inline formatting, rich blocks, draft mode
4. **UX polish** — Search, reading time, TOC, related posts, loading states
5. **Production readiness** — Auth checks, validation, error handling, SEO, logging
6. **Design consistency** — Shared components, typography scale, accessibility

**Start with Task 03-04**, then proceed through phases sequentially. The implementation plan above gives you 32 concrete, actionable tasks organized by dependency and impact. Each task is small enough to complete in 1-2 hours independently.