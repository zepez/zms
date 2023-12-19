import * as z from "zod";
import clientConfig from "@packages/config-client";

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    NEXT_BUNDLE: z.enum(["true", "false"]).optional(),
    AUTH_GITHUB_CLIENT_ID: z.string(),
    AUTH_GITHUB_CLIENT_SECRET: z.string(),
  })
  .transform((obj) => ({
    ...obj,
    NEXT_BUNDLE: obj.NEXT_BUNDLE === "true",
  }));

export default { ...schema.parse(process.env), ...clientConfig };
