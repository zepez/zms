import * as z from "zod";
import clientConfig from "@packages/config-client";

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
  })
  .transform((obj) => ({
    ...obj,
  }));

export default { ...schema.parse(process.env), ...clientConfig };
