import NextAuth, { type NextAuthOptions, type Session, type User, type DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import type { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { JWT } from 'next-auth/jwt';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      status: string;
      company?: string;
    } & DefaultSession['user']
  }

  interface User {
    role: string;
    status: string;
    company?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    status: string;
    company?: string;
  }
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error('No user found with this email');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        if (user.status !== 'active') {
          throw new Error('Your account is not active. Please contact support.');
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          company: user.company
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],
  callbacks: {
    async session({
      session,
      token,
      user
    }: {
      session: Session;
      token: JWT;
      user?: User;
    }): Promise<Session> {
      if (session.user) {
        session.user.id = token.sub || '';
        session.user.role = (token.role as string) || 'user';
        session.user.status = (token.status as string) || 'active';
        session.user.company = token.company as string | undefined;
      }
      return session;
    },
    async jwt({
      token,
      user,
      account
    }: {
      token: JWT;
      user?: User;
      account?: any;
    }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.role = (user as User & { role: string }).role;
        token.status = (user as User & { status: string }).status;
        token.company = (user as User & { company?: string }).company;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  } as const,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
