import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SCHEMA } from "./schema";
import { seedDatabase } from "./seed";

export type D1Result<T> = {
  results: T[];
  success: boolean;
};

export type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T>(column?: string) => Promise<T | null>;
  all: <T>() => Promise<D1Result<T>>;
  run: () => Promise<unknown>;
};

export type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
  batch: (statements: D1PreparedStatement[]) => Promise<unknown>;
  exec: (query: string) => Promise<unknown>;
};

let ready: Promise<void> | null = null;

function cloudflareDatabase(): D1Database {
  const { env } = getCloudflareContext() as unknown as { env: { DB: D1Database } };
  return env.DB;
}

async function prepareDatabase(db: D1Database): Promise<void> {
  const statements = SCHEMA.split(";")
    .map((statement) => statement.trim())
    .filter(Boolean)
    .map((statement) => db.prepare(statement));

  await db.batch(statements);

  const row = await db.prepare("SELECT COUNT(*) AS count FROM activities").first<{ count: number }>();
  if (!row || row.count === 0) {
    await seedDatabase(db);
  }
}

export async function getDb(): Promise<D1Database> {
  const db = cloudflareDatabase();

  if (!ready) {
    ready = prepareDatabase(db).catch((error) => {
      ready = null;
      throw error;
    });
  }

  await ready;
  return db;
}
