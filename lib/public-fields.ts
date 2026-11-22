import { Prisma } from "@prisma/client"

// Fields that public API responses may expose. Use explicit selects so new
// columns (and private ones such as email, password and ownership IDs) never
// leak into responses by default.

// Post author as shown publicly. No id: the client does not need it and
// ownership is checked server-side via Post.authorId.
export const publicAuthorSelect = Prisma.validator<Prisma.UserSelect>()({
  name: true,
  image: true,
})

// Commenter as shown publicly. The id is kept because the comment UI compares
// it with the session user to decide whether to show Edit/Delete; the PUT and
// DELETE handlers enforce ownership server-side regardless.
export const publicCommenterSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  image: true,
})

// Post scalar fields that public responses may expose. Excludes authorId.
export const publicPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  content: true,
  excerpt: true,
  slug: true,
  videoUrl: true,
  thumbnail: true,
  published: true,
  views: true,
  createdAt: true,
  updatedAt: true,
})

// Comment fields that public responses may expose. Excludes postId and
// userId (the commenter's id is available as user.id).
export const publicCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  user: { select: publicCommenterSelect },
})
