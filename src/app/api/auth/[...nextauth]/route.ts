import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Client } from 'pg';
import bcrypt from 'bcrypt';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const client = new Client({
          connectionString: process.env.DATABASE_URL,
        });

        try {
          await client.connect();
          const res = await client.query('SELECT * FROM admin_users WHERE username = $1', [credentials.username]);
          const user = res.rows[0];

          if (user && await bcrypt.compare(credentials.password, user.password_hash)) {
            return { id: user.id.toString(), name: user.username, email: '' }; // email is not used but required by the type
          }
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        } finally {
          await client.end();
        }

        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }
