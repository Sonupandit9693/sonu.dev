import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: "u_viewer" } }, status: "authenticated" }),
}))

import CommentSection from "@/app/blogs/components/CommentSection"

describe("CommentSection display names", () => {
  it("shows 'Anonymous' for a commenter without a name instead of any email-derived text", () => {
    const html = renderToStaticMarkup(
      <CommentSection
        slug="published-post"
        initialComments={[
          {
            id: "c1",
            content: "Nice post",
            createdAt: "2026-01-01T00:00:00.000Z",
            user: { id: "u_commenter", name: null, image: null },
          },
        ]}
      />,
    )

    expect(html).toContain("Anonymous")
    expect(html).not.toContain("@")
  })

  it("shows the commenter's name when present", () => {
    const html = renderToStaticMarkup(
      <CommentSection
        slug="published-post"
        initialComments={[
          {
            id: "c2",
            content: "Hello",
            createdAt: "2026-01-01T00:00:00.000Z",
            user: { id: "u_named", name: "Asha", image: null },
          },
        ]}
      />,
    )

    expect(html).toContain("Asha")
  })
})
