import Database from "better-sqlite3";
import { ensureDataPath, getDataPath } from "@packages/common";

const main = () => {
  ensureDataPath("db");

  const dbPath = getDataPath("db/sqlite.db");
  new Database(dbPath);

  process.exit(0);
};

void main();
