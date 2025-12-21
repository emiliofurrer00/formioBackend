import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// only load .env locally
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config();
} 

console.log("Has DATABASE_URL key:", Object.prototype.hasOwnProperty.call(process.env, "DATABASE_URL"));
console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length ?? 0);
console.log("ENV KEYS:", Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("DB")));

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
