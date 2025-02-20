/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    experimental: {
      // Otimiza o carregamento do Prisma Client
      serverComponentsExternalPackages: ["@prisma/client"],
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals = [...(config.externals || []), "encoding", "_http_common"];
      }
      return config;
    },
  };
  
  export default nextConfig;