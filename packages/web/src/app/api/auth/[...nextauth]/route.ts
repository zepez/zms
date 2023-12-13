import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import config from "@packages/config-server";
import { db } from "@packages/db";

const handler = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GithubProvider({
      clientId: config.AUTH_GITHUB_CLIENT_ID,
      clientSecret: config.AUTH_GITHUB_CLIENT_SECRET,
    }),
  ],
});

export { handler as GET, handler as POST };
