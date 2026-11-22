// In-memory stand-in for the Prisma client. It applies each query's real
// `select` / `include` to full fixture rows that DO contain private fields
// (email, password, authorId, postId, userId). A route that selects or includes
// a private field therefore leaks it in tests exactly as it would in production.
// No database is used.

type Row = Record<string, unknown>
type Shape = Record<string, unknown>

const RELATIONS = new Set(["author", "user", "comments", "likes", "posts", "_count"])

function scalars(row: Row): Row {
  return Object.fromEntries(Object.entries(row).filter(([key]) => !RELATIONS.has(key)))
}

function projectValue(value: unknown, spec: unknown): unknown {
  if (spec === true) return value
  if (value === null || value === undefined) return value
  const nested = spec as { select?: Shape; include?: Shape }
  if (Array.isArray(value)) return value.map((item) => projectValue(item, spec))
  return project(value as Row, nested.select, nested.include)
}

export function project(row: Row, select?: Shape, include?: Shape): Row {
  if (select) {
    const out: Row = {}
    for (const [key, spec] of Object.entries(select)) {
      if (spec) out[key] = projectValue(row[key], spec)
    }
    return out
  }
  const out = scalars(row)
  for (const [key, spec] of Object.entries(include ?? {})) {
    if (spec) out[key] = projectValue(row[key], spec)
  }
  return out
}

export const users = {
  author: {
    id: "u_author",
    name: "Post Author",
    email: "author@example.com",
    password: "$2a$10$hash-author",
    image: null,
  },
  commenter: {
    id: "u_commenter",
    name: null,
    email: "commenter@example.com",
    password: "$2a$10$hash-commenter",
    image: null,
  },
  other: {
    id: "u_other",
    name: "Someone Else",
    email: "other@example.com",
    password: "$2a$10$hash-other",
    image: null,
  },
}

const created = new Date("2026-01-01T00:00:00.000Z")

function comment(postId: string): Row {
  return {
    id: `c_${postId}`,
    content: "Nice post",
    createdAt: created,
    updatedAt: created,
    postId,
    userId: users.commenter.id,
    user: users.commenter,
  }
}

function post(id: string, slug: string, published: boolean): Row {
  return {
    id,
    title: `Title ${slug}`,
    content: "Hello world",
    excerpt: null,
    slug,
    videoUrl: null,
    thumbnail: null,
    published,
    views: 3,
    createdAt: created,
    updatedAt: created,
    authorId: users.author.id,
    author: users.author,
    comments: [comment(id)],
    _count: { likes: 2, comments: 1 },
  }
}

export function createFakePrisma() {
  const posts: Row[] = [
    post("p_published", "published-post", true),
    post("p_draft", "draft-post", false),
  ]

  const findPost = (where: { slug?: string; id?: string }) =>
    posts.find((p) => (where.slug ? p.slug === where.slug : p.id === where.id))

  const calls: Record<string, unknown[]> = {}
  const record = (name: string, args: unknown) => {
    if (!calls[name]) calls[name] = []
    calls[name].push(args)
  }

  return {
    calls,
    post: {
      findMany: async (args: { where?: { published?: boolean; authorId?: string }; select?: Shape; include?: Shape }) => {
        record("post.findMany", args)
        return posts
          .filter((p) => args.where?.published === undefined || p.published === args.where.published)
          .filter((p) => args.where?.authorId === undefined || p.authorId === args.where.authorId)
          .map((p) => project(p, args.select, args.include))
      },
      findUnique: async (args: { where: { slug?: string; id?: string }; select?: Shape; include?: Shape }) => {
        record("post.findUnique", args)
        const found = findPost(args.where)
        return found ? project(found, args.select, args.include) : null
      },
      update: async (args: { where: { id: string }; data: Row; select?: Shape; include?: Shape }) => {
        record("post.update", args)
        const found = findPost(args.where)
        if (!found) throw new Error("not found")
        if (args.data.published !== undefined) found.published = args.data.published
        return project(found, args.select, args.include)
      },
      create: async (args: { data: Row; select?: Shape; include?: Shape }) => {
        record("post.create", args)
        const row = post("p_new", String(args.data.slug), Boolean(args.data.published))
        Object.assign(row, args.data, { comments: [], _count: { likes: 0, comments: 0 } })
        return project(row, args.select, args.include)
      },
    },
    like: {
      findUnique: async (args: unknown) => {
        record("like.findUnique", args)
        return null
      },
    },
    comment: {
      findUnique: async (args: { where: { id: string } }) => {
        record("comment.findUnique", args)
        const found = posts.flatMap((p) => p.comments as Row[]).find((c) => c.id === args.where.id)
        return found ? scalars(found) : null
      },
      create: async (args: { data: Row; select?: Shape; include?: Shape }) => {
        record("comment.create", args)
        const row: Row = {
          id: "c_new",
          content: args.data.content,
          createdAt: created,
          updatedAt: created,
          postId: args.data.postId,
          userId: args.data.userId,
          user: Object.values(users).find((u) => u.id === args.data.userId),
        }
        return project(row, args.select, args.include)
      },
      update: async (args: { where: { id: string }; data: Row; select?: Shape; include?: Shape }) => {
        record("comment.update", args)
        const found = posts.flatMap((p) => p.comments as Row[]).find((c) => c.id === args.where.id)
        if (!found) throw new Error("not found")
        Object.assign(found, args.data)
        return project(found, args.select, args.include)
      },
    },
  }
}

// Walks any JSON value and returns every path whose key is in `forbidden`.
export function findKeys(value: unknown, forbidden: string[], path = "$"): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findKeys(item, forbidden, `${path}[${index}]`))
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => [
      ...(forbidden.includes(key) ? [`${path}.${key}`] : []),
      ...findKeys(child, forbidden, `${path}.${key}`),
    ])
  }
  return []
}
