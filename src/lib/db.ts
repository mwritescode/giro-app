import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { SCHEMA } from "./schema";
import { seedDatabase } from "./seed";

const DB_PATH = process.env.DATABASE_PATH ?? join(process.cwd(), ".data", "giro.db");

const globalForDb = globalThis as unknown as { giroDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  if (globalForDb.giroDb) {
    return globalForDb.giroDb;
  }

  mkdirSync(dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec(SCHEMA);

  const { count } = db.prepare("SELECT COUNT(*) AS count FROM activities").get() as { count: number };
  if (count === 0) {
    seedDatabase(db);
  }

  globalForDb.giroDb = db;
  return db;
}
