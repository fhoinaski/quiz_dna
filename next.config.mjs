/** @type {import('next').NextConfig} */
const nextConfig = {
    // Desabilita ESLint durante build
    eslint: {
      ignoreDuringBuilds: true,
    },
    // Desabilita verificação de tipos durante build
    typescript: {
      ignoreBuildErrors: true,
    },
    // Configuração para permitir a inicialização adequada do Prisma
    webpack: (config, { isServer }) => {
      if (isServer) {
        if (!config.externals) {
          config.externals = [];
        } else if (!Array.isArray(config.externals)) {
          config.externals = [config.externals];
        }
        
        // Adiciona módulos ao externals para compatibilidade
        config.externals.push('_http_common', 'encoding');
      }
      return config;
    },
  };
  
  export default nextConfig;