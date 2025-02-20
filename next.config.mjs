/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals = [
          ...(config.externals || []), 
          'encoding', 
          '@prisma/client/runtime'
        ]
      }
      return config
    },
  };
  
  export default nextConfig;