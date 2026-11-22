# Blog System Setup Guide

## 1. Create Neon Database (2 minutes)

1. Go to https://neon.tech
2. Sign up with GitHub (free tier)
3. Click "Create Project"
4. Name it: `sonu-portfolio-blog`
5. Select region closest to you
6. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```

## 2. Add to .env file

Add this line to your `.env` file:
```
DATABASE_URL="your-connection-string-here"
NEXTAUTH_SECRET="run this command: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Run Setup Commands

After adding DATABASE_URL to .env, run:
```bash
npx prisma generate
npx prisma db push
```

## Done! Your blog system will be ready.
