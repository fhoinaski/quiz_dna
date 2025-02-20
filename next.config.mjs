/** @type {import('next').NextConfig} */
const nextConfig = {
    // Otimização para o Prisma
    webpack: (config, { isServer }) => {
      if (isServer) {
        // Adiciona módulos específicos aos externals para garantir compatibilidade
        if (!config.externals) {
          config.externals = [];
        } else if (!Array.isArray(config.externals)) {
          config.externals = [config.externals];
        }
        
        config.externals.push(
          '_http_common',
          'encoding'
        );
      }
      
      return config;
    },
    experimental: {
      // Habilita a otimização do Edge Runtime se necessário
      serverActions: {
        allowedOrigins: ['localhost:3000', '*.vercel.app'],
      },
    },
  };
  
  export default nextConfig;