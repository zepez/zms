import * as z from "zod";
import clientConfig from "@packages/config-client";

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    TURSO_CONNECTION_URL: z.string().url(),
    TURSO_CONNECTION_TOKEN: z.string(),
    AUTH_GITHUB_CLIENT_ID: z.string(),
    AUTH_GITHUB_CLIENT_SECRET: z.string(),
  })
  .transform((obj) => ({
    ...obj,
  }));

export default { ...schema.parse(process.env), ...clientConfig };
