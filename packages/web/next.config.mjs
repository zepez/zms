const nextConfig = {
  experimental: {
    esmExternals: false,
    serverComponentsExternalPackages: ["drizzle-orm"],
  },
};

export default nextConfig;
