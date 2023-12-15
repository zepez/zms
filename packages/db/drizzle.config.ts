import type { Config } from "drizzle-kit";
import config from "@packages/config-server";

export default {
  out: "./src/migrations",
  schema: ["./src/schema/index.ts"],
  driver: "turso",
  dbCredentials: {
    url: config.TURSO_CONNECTION_URL,
    authToken: config.TURSO_CONNECTION_TOKEN,
  },
} satisfies Config;
