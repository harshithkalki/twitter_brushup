import { handlers } from "~/server/auth";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import {prisma} from "~/lib/prisma";
import {compare} from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const authcopnfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "string" },
      },
      async authorize(credentials: { email?: string; password?: string }){
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }   
         const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("No user found with the given email");
        }
        const isValidPassword = await compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }
        return { id: user.id, email: user.email };
      },
    }),
  ],


export const { GET, POST } = handlers;
    