import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const schemaPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "schema.sql",
);

export async function loadSchemaSql(): Promise<string> {
  return readFile(schemaPath, "utf8");
}

export function createPool(databaseUrl: string): pg.Pool {
  return new pg.Pool({ connectionString: databaseUrl });
}

export async function migrate(pool: pg.Pool): Promise<void> {
  const sql = await loadSchemaSql();
  const statements = sql
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  for (const statement of statements) {
    await pool.query(statement);
  }
}
