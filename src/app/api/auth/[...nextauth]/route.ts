import { handlers } from "~/server/auth";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import {prisma} from "~/lib/prisma";
import {compare} from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
type CredentialsType = {
    email: string;
    password: string;
  };

const authcopnfig: NextAuthConfig = {
  providers: [
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

          const isValid = await compare(creds.password, user.password as string);
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

    