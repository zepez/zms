const nextConfig = {
  experimental: {
    esmExternals: false,
    serverComponentsExternalPackages: ["drizzle-orm, @libsql/client, libsql"],
  },
};

export default nextConfig;
