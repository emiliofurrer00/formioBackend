import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// only load .env locally
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config();
} 

const url = process.env.DATABASE_URL || "";

const redacted = url.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");
console.log("DB URL (redacted):", redacted);

try {
  const u = new URL(url);
  console.log("DB host:", u.hostname, "port:", u.port, "db:", u.pathname);
} catch {
  console.log("DATABASE_URL is not a valid URL shape");
}

if (!url) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({
  connectionString: url,
});

export const prisma =
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"], // enable if you want
  });   
