import { execSync } from "child_process";
import { randomUUID } from "crypto";
import { PrismaClient } from "../generated/prisma";
import "dotenv/config";

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schema: string) {
  const url = new URL(process.env.DATABASE_URL!);
  url.searchParams.set("schema", schema);
  return url.toString();
}

beforeAll(async () => {
  const schema = `test_${randomUUID()}`;
  const databaseURL = generateUniqueDatabaseURL(schema);
  process.env.DATABASE_URL = databaseURL;

  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

  execSync(`pnpm prisma db push`, { stdio: "inherit" });
});

afterAll(async () => {
  const schema = new URL(process.env.DATABASE_URL!).searchParams.get("schema");
  if (schema) {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  }
  await prisma.$disconnect();
});
