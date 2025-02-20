// @ts-nocheck

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para permitir a inicialização adequada do Prisma
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Adiciona um plugin para garantir que o Prisma seja gerado corretamente 
      // durante o build da Vercel
      if (!config.externals) {
        config.externals = [];
      } else if (!Array.isArray(config.externals)) {
        config.externals = [config.externals];
      }
      config.externals.push('_http_common');
    }
    return config;
  },
};

module.exports = nextConfig;