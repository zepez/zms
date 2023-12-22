import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import config from "@packages/config-server";
import { db } from "@packages/db";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub({
      clientId: config.AUTH_GITHUB_CLIENT_ID,
      clientSecret: config.AUTH_GITHUB_CLIENT_SECRET,
    }),
  ],
});
