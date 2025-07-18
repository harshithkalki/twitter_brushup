import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import {prisma} from "~/lib/prisma";
import {compare} from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

type CredentialsType = {
    email: string;
    password: string;
  };

export const authconfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),


    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "email", type: "string", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
        async authorize(
            credentials,
            req
          ) {
            const creds = credentials as CredentialsType;
          if (!creds?.email || !creds?.password) {
            throw new Error("Missing email or password");
          }
      
          const user = await prisma.user.findUnique({
            where: { email: creds.email }, 
          });
      
          if (!user) throw new Error("No user found");
          if (!user || typeof user.password !== "string") {
            throw new Error("User not found or password issue");
          }

          const isValid = await compare(creds.password, user.password );
          if (!isValid) throw new Error("Invalid password");
      
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          };
        },
      }),
      
  ],
  session: {
    strategy: "database",
  }

}

const handlers = NextAuth(authconfig);

export { handlers as GET, handlers as POST };

    