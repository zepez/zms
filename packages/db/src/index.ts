import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import config from "@packages/config-server";
import * as schema from "./schema";

export const client = createClient({
  url: config.TURSO_CONNECTION_URL,
  authToken: config.TURSO_CONNECTION_TOKEN,
});

export const db = drizzle(client, {
  schema,
  logger: true,
});

export * from "./schema";
export * as schema from "./schema";
