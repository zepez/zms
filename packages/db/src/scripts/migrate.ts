import path from "path";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "../index";

const main = async () => {
  await migrate(db, {
    migrationsFolder: path.join(__dirname, "..", "migrations"),
  });

  process.exit(0);
};

void main();
