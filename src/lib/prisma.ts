import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

console.log("Has DATABASE_URL key:", Object.prototype.hasOwnProperty.call(process.env, "DATABASE_URL"));
console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length ?? 0);
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({
  connectionString: url,
});

export const prisma =
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"], // enable if you want
  });   
