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
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials: { email?: string; password?: string }) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing email or password");
          }
      
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }, 
          });
      
          if (!user) throw new Error("No user found");
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) throw new Error("Invalid password");
      
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          };
        },
      })
      
  ],

}
export const { GET, POST } = handlers;

    