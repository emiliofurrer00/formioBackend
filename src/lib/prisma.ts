import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// Prevent creating many PrismaClient instances during dev hot reload
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"], // enable if you want
  });   
