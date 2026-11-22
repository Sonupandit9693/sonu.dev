import { Prisma } from "@prisma/client"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { isAdminEmail } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, clientIpBucket, RATE_LIMITS } from "@/lib/rate-limit"
import { normalizeEmail, parseDisplayName, PASSWORD_MIN_LENGTH } from "@/lib/validation"
import bcrypt from "bcryptjs"

// Generic messages: never reveal whether an account exists.
export const INVALID_SIGN_IN = "Invalid email or password"
export const SIGN_UP_FAILED = "Unable to create account"
export const TOO_MANY_ATTEMPTS = "Too many attempts. Please try again later."

// bcrypt hash of a random, discarded secret. Compared against when the email is
// unknown so failed sign-ins take the same time with or without an account.
const DUMMY_PASSWORD_HASH = "$2b$10$t.9gQbqnyt0Rui2T3fjpa.LjekvXfxQK5aUbg.viq6t0umwJBNQ.y"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignup: { label: "Is Signup", type: "text" }
      },
      async authorize(credentials, req) {
        const isSignup = credentials?.isSignup === "true"
        const ipBucket = clientIpBucket(req?.headers)

        if (isSignup) {
          // Rate limit before any database or hashing work.
          if (!(await checkRateLimit(RATE_LIMITS.signUpPerIp, ipBucket)).allowed) {
            throw new Error(TOO_MANY_ATTEMPTS)
          }

          const email = normalizeEmail(credentials?.email)
          if (!email) throw new Error("Enter a valid email address")
          if (typeof credentials?.password !== "string" || credentials.password.length < PASSWORD_MIN_LENGTH) {
            throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
          }
          // Never derive a public display name from the email address.
          // A blank name is stored as null and shown as "Anonymous".
          const name = parseDisplayName(credentials.name)
          if (!name.ok) throw new Error(name.error)

          const existingUser = await prisma.user.findUnique({ where: { email } })
          if (existingUser) throw new Error(SIGN_UP_FAILED)

          const hashedPassword = await bcrypt.hash(credentials.password, 10)

          try {
            const user = await prisma.user.create({
              data: { email, password: hashedPassword, name: name.value },
            })
            return { id: user.id, email: user.email, name: user.name, image: user.image }
          } catch (error) {
            // A concurrent sign-up for the same email hits the unique constraint.
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
              throw new Error(SIGN_UP_FAILED)
            }
            throw error
          }
        }

        const email = normalizeEmail(credentials?.email)
        const [ipLimit, emailLimit] = await Promise.all([
          checkRateLimit(RATE_LIMITS.signInPerIp, ipBucket),
          // Per-account limit applies even when the IP bucket is shared or spoofed.
          checkRateLimit(RATE_LIMITS.signInPerEmail, email ?? "invalid-email"),
        ])
        if (!ipLimit.allowed || !emailLimit.allowed) throw new Error(TOO_MANY_ATTEMPTS)

        const password = typeof credentials?.password === "string" ? credentials.password : ""
        const user = email ? await prisma.user.findUnique({ where: { email } }) : null

        // Always run one bcrypt comparison so response time does not reveal
        // whether the account exists.
        const isPasswordValid = await bcrypt.compare(password, user?.password ?? DUMMY_PASSWORD_HASH)
        if (!user || !password || !isPasswordValid) throw new Error(INVALID_SIGN_IN)

        return { id: user.id, email: user.email, name: user.name, image: user.image }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        // UI visibility only. Route handlers authorize with requireAdmin().
        session.user.isAdmin = isAdminEmail(session.user.email)
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
