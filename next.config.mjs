/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals = [
          ...(config.externals || []), 
          'encoding', 
          '_http_common'
        ]
      }
      return config
    },
    // Desabilite a otimização do swc para resolver potenciais problemas com Prisma
    swcMinify: false,
  };
  
  export default nextConfig;