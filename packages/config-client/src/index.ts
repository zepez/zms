import * as z from "zod";

const schema = z
  .object({
    NEXT_PUBLIC_WEB_PROTOCOL: z.enum(["http", "https"]).default("http"),
    NEXT_PUBLIC_WEB_HOST: z.string().default("localhost"),
    NEXT_PUBLIC_WEB_PORT: z.string().default("3000"),
  })
  .transform((obj) => ({
    ...obj,
    NEXT_PUBLIC_WEB_PORT: parseInt(obj.NEXT_PUBLIC_WEB_PORT),
    WEB_URL: `${obj.NEXT_PUBLIC_WEB_PROTOCOL}://${obj.NEXT_PUBLIC_WEB_HOST}:${obj.NEXT_PUBLIC_WEB_PORT}`,
  }));

export default schema.parse({
  NEXT_PUBLIC_WEB_HOST: process.env.NEXT_PUBLIC_WEB_HOST,
  NEXT_PUBLIC_WEB_PORT: process.env.NEXT_PUBLIC_WEB_PORT,
  NEXT_PUBLIC_WEB_PROTOCOL: process.env.NEXT_PUBLIC_WEB_PROTOCOL,
});
