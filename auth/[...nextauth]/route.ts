import { v4 as uuidv4 } from 'uuid';
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
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
      
      // Create UUID for the user
      const userId = uuidv4();

      if (emailDomain === 'vitstudent.ac.in') {
        // Handle student login
        user.role = 'student';
        user.userId = userId;
        return true;
      } 
      else if (emailDomain === 'vit.ac.in') {
        // Handle faculty login
        user.role = 'faculty';
        user.userId = userId;
        return true;
      }
      
      // Reject other email domains
      return false;
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.role = user.role;
        session.user.userId = user.userId;
      }
      return session;
    }
  }
} 