import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

export const prisma = new PrismaClient({
  log: env?.NOTE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  datasourceUrl: env?.DATABASE_URL
})
