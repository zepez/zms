import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { getDataPath } from "@packages/common";
import * as schema from "./schema";

const dbPath = getDataPath("db/sqlite.db");
const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, {
  schema,
  logger: true,
});

export * as schema from "./schema";
export * from "./qs";
