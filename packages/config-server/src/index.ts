import * as z from "zod";

const mock = {
  NODE_ENV: "development",
  WEB_PROTOCOL: "http",
  WEB_HOST: "localhost",
  WEB_PORT: "3000",
  AUTH_GITHUB_CLIENT_ID: "githubClientId",
  AUTH_GITHUB_CLIENT_SECRET: "githubClientSecret",
  FLAG_MOCK_CONFIG: "true",
  FLAG_NEXT_BUNDLE: "false",
} as const;

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default(mock.NODE_ENV),
    WEB_PROTOCOL: z.enum(["http", "https"]).default(mock.WEB_PROTOCOL),
    WEB_HOST: z.string().default(mock.WEB_HOST),
    WEB_PORT: z.string().default(mock.WEB_PORT),
    AUTH_GITHUB_CLIENT_ID: z.string(),
    AUTH_GITHUB_CLIENT_SECRET: z.string(),
    FLAG_MOCK_CONFIG: z.enum(["true", "false"]).default("false"),
    FLAG_NEXT_BUNDLE: z.enum(["true", "false"]).default(mock.FLAG_NEXT_BUNDLE),
  })
  .transform((obj) => ({
    ...obj,
    WEB_PORT: parseInt(obj.WEB_PORT),
    WEB_URL: `${obj.WEB_PROTOCOL}://${obj.WEB_HOST}:${obj.WEB_PORT}`,
    FLAG_MOCK_CONFIG: obj.FLAG_MOCK_CONFIG === "true",
    // NOTE: This is checking process.env on purpose.
    // It is set manually by webpack during the build process.
    FLAG_NEXT_BUNDLE: process.env.FLAG_NEXT_BUNDLE === "true",
  }));

const config = schema.parse(
  process.env.FLAG_MOCK_CONFIG === "true" ? mock : process.env,
);

export default config;
