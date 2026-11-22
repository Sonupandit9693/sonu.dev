# Blog System - Complete Setup & Usage Guide

## ✅ What's Been Built

Your portfolio now has a complete blog system with:

### Features
- ✅ **Authentication**: Signup/login with NextAuth.js (auto-session after signup)
- ✅ **Blog Posts**: Create posts with title, content, demo video, and thumbnail
- ✅ **Like System**: Auth-gated - users must signup to like posts
- ✅ **Comment System**: Auth-gated - users must signup to comment
- ✅ **User Profile**: Shows in top-right corner when logged in
- ✅ **Database**: Neon PostgreSQL for persistent storage
- ✅ **Responsive Design**: Works on desktop and mobile

### Tech Stack
- **Frontend**: Next.js 13, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Neon PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js with JWT sessions
- **Storage**: Neon PostgreSQL (free tier)

## 🚀 How to Run

1. **Start the development server**:
   ```bash
   cd /home/sonukumar/sonu.dev/sonu.dev
   npm run dev
   ```

2. **Open in browser**:
   ```
   http://localhost:3000
   ```

3. **Navigate to blogs**:
   - Click "Blogs" in the navigation
   - Or go to: http://localhost:3000/blogs

## 📝 How to Use

### For Visitors (Not Logged In)
- ✅ View all blog posts
- ✅ Read blog post details
- ✅ See like and comment counts
- ❌ Cannot like or comment (must signup first)

### For Users (Logged In)
1. **Signup**: Click on "Like" or "Comment" → Signup modal appears
2. **Auto-login**: After signup, you're automatically logged in
3. **User Profile**: Your profile appears in top-right corner
4. **Like Posts**: Click the heart icon on any post
5. **Comment**: Write comments on blog posts
6. **Create Posts**: Click "Create New Post" button

### Creating a Blog Post
1. **Login** to your account
2. Click **"Create New Post"** button on blogs page
3. Fill in the form:
   - **Title**: Your blog post title (required)
   - **Slug**: Auto-generated URL (you can edit it)
   - **Excerpt**: Short description (optional)
   - **Content**: Your blog content (required)
   - **Video URL**: Demo video embed URL (optional)
     - For YouTube: Use embed URL like `https://www.youtube.com/embed/VIDEO_ID`
     - For Vimeo: Use `https://player.vimeo.com/video/VIDEO_ID`
   - **Thumbnail**: Image URL for post thumbnail (optional)
4. Click **"Publish Post"**

### Managing Your Posts
- **View**: Click on any post to see details
- **Edit**: Click edit icon (only on your own posts)
- **Delete**: Click delete icon (only on your own posts)

## 🗄️ Database Schema

### Tables Created
- **User**: Stores user accounts (email, password, name)
- **Post**: Blog posts with content, video, thumbnail
- **Comment**: Comments on blog posts
- **Like**: Likes on blog posts (one per user per post)

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based sessions
- ✅ Auth-gated actions (like, comment, create posts)
- ✅ User-specific actions (edit/delete own posts only)
- ✅ SQL injection protection (Prisma ORM)

## 📁 Files Created

### Database & Auth
- `/prisma/schema.prisma` - Database schema
- `/lib/prisma.ts` - Prisma client
- `/lib/auth.ts` - NextAuth configuration
- `/app/api/auth/[...nextauth]/route.ts` - NextAuth endpoint

### API Routes
- `/app/api/posts/route.ts` - List & create posts
- `/app/api/posts/[slug]/route.ts` - Get single post
- `/app/api/posts/[slug]/like/route.ts` - Toggle like
- `/app/api/posts/[slug]/comments/route.ts` - Add comment

### Pages
- `/app/blogs/page.tsx` - Blog listing page
- `/app/blogs/BlogsClient.tsx` - Client-side blog list
- `/app/blogs/[slug]/page.tsx` - Blog detail page
- `/app/blogs/create/page.tsx` - Create new post page

### Components
- `/app/components/AuthModal.tsx` - Signup/login modal
- `/app/components/UserProfile.tsx` - User profile dropdown
- `/app/components/AuthProvider.tsx` - NextAuth session provider

### Updated Files
- `/app/layout.tsx` - Added AuthProvider
- `/app/components/nav.tsx` - Added user profile to navigation

## 🎨 Design

The blog system matches your existing portfolio design:
- Dark theme with zinc colors
- Gradient backgrounds
- Smooth transitions and hover effects
- Responsive grid layout
- Consistent typography

## 🔄 Workflow

### New User Flow
1. Visitor lands on blogs page
2. Sees blog posts but can't interact
3. Clicks "Like" or "Comment"
4. Signup modal appears
5. User signs up
6. **Automatically logged in** (no separate login needed)
7. Can now like, comment, and create posts

### Returning User Flow
1. User visits site
2. Clicks "Sign In" from user profile area
3. Logs in
4. Session persists across page navigation

## 🚢 Deployment

When ready to deploy:

1. **Environment Variables** (add to Vercel/hosting):
   ```
   DATABASE_URL="your-neon-connection-string"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="https://yourdomain.com"
   ```

2. **Deploy**:
   - Push to GitHub
   - Connect to Vercel
   - Deploy automatically

## 📊 Features Summary

| Feature | Status | Auth Required |
|---------|--------|---------------|
| View Posts | ✅ | No |
| Read Post Details | ✅ | No |
| Like Posts | ✅ | Yes |
| Comment on Posts | ✅ | Yes |
| Create Posts | ✅ | Yes |
| Edit Own Posts | ✅ | Yes (owner only) |
| Delete Own Posts | ✅ | Yes (owner only) |
| User Profile | ✅ | Yes |
| Auto-login after Signup | ✅ | - |

## 🎯 Next Steps

1. **Test the system**: Run `npm run dev` and test all features
2. **Add your first post**: Login and create a blog post
3. **Customize styling**: Adjust colors/design in the component files
4. **Add image uploads**: Consider adding Cloudinary or S3 for image hosting
5. **Add rich text editor**: Consider adding a WYSIWYG editor for better content creation

## 💡 Tips

- **Video URLs**: Make sure to use embed URLs, not watch URLs
- **Thumbnails**: Use direct image URLs (ending in .jpg, .png, etc.)
- **Slug**: Keep it URL-friendly (lowercase, hyphens, no spaces)
- **Content**: Separate paragraphs with blank lines for better formatting

## 🐛 Troubleshooting

If you encounter issues:

1. **Database connection error**: Check DATABASE_URL in `.env`
2. **Auth not working**: Check NEXTAUTH_SECRET is set
3. **Build errors**: Run `npm install` to ensure all dependencies are installed
4. **Port already in use**: Change port with `npm run dev -- -p 3001`

---

**Your blog system is now complete and ready to use!** 🎉

Start the dev server and navigate to `/blogs` to see it in action.
