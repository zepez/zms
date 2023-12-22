const nextConfig = {
  env: {
    FLAG_NEXT_BUNDLE: "true",
  },
  experimental: {
    esmExternals: false,
    serverComponentsExternalPackages: ["drizzle-orm"],
  },
};

export default nextConfig;
