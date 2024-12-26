import 'next-auth';
import { DefaultSession } from "next-auth"

declare module 'next-auth' {
  interface User {
    role?: 'student' | 'faculty';
    userId?: string;
  }

  interface Session {
    user: {
      role?: 'student' | 'faculty';
      userId?: string;
      email?: string | null;
    } & DefaultSession['user'];
  }
} 