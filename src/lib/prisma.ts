// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` usage in Next.js hot-reload
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query"], // remove in production if you prefer
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
