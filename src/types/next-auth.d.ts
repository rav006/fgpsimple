import NextAuth, { type DefaultSession, type User as DefaultUser } from 'next-auth';
import { type JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Ensure id is always a string
      role: string; // Ensure role is always a string
    } & DefaultSession['user'];
  }

  // Extend the default User model to include id (as string) and role
  interface User extends DefaultUser {
    id: string; // NextAuth expects id to be a string in the User object passed to jwt callback
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string; // Ensure id is always a string
    role: string; // Ensure role is always a string
  }
}
