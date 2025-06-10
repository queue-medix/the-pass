/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle .glb, .gltf files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });

    // Critical: Fix for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
      
      // Ensure single instance of React
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
        'three': require.resolve('three'),
      };
    }
    
    return config;
  },
  // Ensure proper static optimization
  swcMinify: true,
}

export default nextConfig
