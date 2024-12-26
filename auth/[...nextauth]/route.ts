import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../../lib/prisma"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      const emailDomain = user.email.split('@')[1];
      
      if (emailDomain === 'vitstudent.ac.in') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'STUDENT' }
        });
        return true;
      } 
      else if (emailDomain === 'vit.ac.in') {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'FACULTY' }
        });
        return true;
      }
      return false;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user = {
          ...session.user,
          role: user.role,
          userId: user.id
        };
      }
      return session;
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 