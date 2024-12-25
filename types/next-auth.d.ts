import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    userId?: string
  }

  interface Session {
    user: {
      role?: string
      userId?: string
    } & DefaultSession["user"]
  }
} 