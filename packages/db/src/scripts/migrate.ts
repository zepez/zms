import path from "path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "../index";

const main = () => {
  migrate(db, {
    migrationsFolder: path.join(__dirname, "..", "migrations"),
  });

  process.exit(0);
};

void main();
