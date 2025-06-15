import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('[NextAuth Authorize] Attempting to authorize user with email:', credentials?.email);
        if (!credentials?.email || !credentials.password) {
          console.log('[NextAuth Authorize] Missing email or password in credentials.');
          return null;
        }

        try {
          const result = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);
          const user = result[0];

          if (!user) {
            console.log(`[NextAuth Authorize] User not found in DB for email: ${credentials.email}`);
            return null;
          }
          
          // Log the retrieved user details, including the presence and type of password
          console.log(`[NextAuth Authorize] User found in DB. Email: ${user.email}, Role: ${user.role}, Password stored (type): ${typeof user.password}, Password present: ${!!user.password}`);

          if (!user.password) { 
            console.log(`[NextAuth Authorize] User ${user.email} has no password set in the database.`);
            return null;
          }

          // Ensure user.password is a string before bcrypt.compare
          if (typeof user.password !== 'string') {
              console.error(`[NextAuth Authorize] User password for ${user.email} is not a string. Type: ${typeof user.password}. Value:`, user.password);
              return null;
          }
          // Log the hash from DB to verify its format (DO NOT LOG credentials.password)
          console.log(`[NextAuth Authorize] DB password hash for ${user.email}: ${user.password.substring(0, 10)}... (length: ${user.password.length})`);


          console.log(`[NextAuth Authorize] About to compare provided password with stored hash for user: ${user.email}`);
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValidPassword) {
            console.log(`[NextAuth Authorize] Password validation FAILED for user: ${user.email}`);
            return null;
          }

          console.log(`[NextAuth Authorize] Password validation SUCCESSFUL for user: ${user.email}`);
          return {
            id: user.id.toString(), 
            email: user.email,
            name: user.name,
            role: user.role, 
          };
        } catch (error) {
          console.error('[NextAuth Authorize] Error during authorization process:', error);
          return null; // Return null on any unexpected error during authorization
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) { // Removed unused profile and isNewUser parameters
      console.log('[NextAuth JWT Callback] Invoked.');
      console.log('[NextAuth JWT Callback] Initial token:', JSON.stringify(token, null, 2));
      if (account) { // This is usually present on initial sign-in
        console.log('[NextAuth JWT Callback] Account object present (sign-in flow):', JSON.stringify(account, null, 2));
      }
      if (user) { // `user` object is passed from `authorize` on successful sign-in
        console.log('[NextAuth JWT Callback] User object present (from authorize/sign-in):', JSON.stringify(user, null, 2));
        token.id = user.id;
        token.role = user.role;
        // token.name = user.name; // Already part of default token if name is in user object from authorize
        // token.email = user.email; // Already part of default token
        console.log('[NextAuth JWT Callback] Token after merging user info:', JSON.stringify(token, null, 2));
      } else {
        console.log('[NextAuth JWT Callback] User object NOT present (e.g., session validation, not initial sign-in).');
      }
      return token;
    },
    async session({ session, token }) { // Removed unused user (sessionCallbackUser) parameter
      console.log('[NextAuth Session Callback] Invoked.');
      console.log('[NextAuth Session Callback] Initial session:', JSON.stringify(session, null, 2));
      console.log('[NextAuth Session Callback] Token received:', JSON.stringify(token, null, 2));

      if (session.user) {
        if (token.id && typeof token.id === 'string' && token.role && typeof token.role === 'string') {
          session.user.id = token.id;
          session.user.role = token.role;
          // session.user.name = token.name as string; // Ensure name is carried over if needed
          // session.user.email = token.email as string; // Ensure email is carried over
          console.log('[NextAuth Session Callback] Session user updated with id and role from token:', JSON.stringify(session.user, null, 2));
        } else {
          console.warn('[NextAuth Session Callback] Token did not contain id or role, or they were not strings. Session user NOT fully updated.');
          console.warn('[NextAuth Session Callback] Token details: id=', token.id, '(type:', typeof token.id, '), role=', token.role, '(type:', typeof token.role, ')');
        }
      } else {
        console.warn('[NextAuth Session Callback] session.user was not initially present. This is unexpected.');
      }
      console.log('[NextAuth Session Callback] Final session object:', JSON.stringify(session, null, 2));
      return session;
    }
  },
  pages: {
    signIn: '/login', 
    // error: '/auth/error', // Optional: a custom error page
    // signOut: '/auth/signout' 
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Enable NextAuth debug messages in development
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };