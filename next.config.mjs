/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    // Configuração para permitir a inicialização adequada do Prisma
    webpack: (config, { isServer }) => {
      if (isServer) {
        // Adiciona um plugin para garantir que o Prisma seja gerado corretamente 
        // durante o build da Vercel
        config.externals = [...config.externals, '_http_common']
      }
      return config
    },
  }
  
  export default nextConfig;