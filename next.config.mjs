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
  webpack: (config, { isServer, dev }) => {
    // Critical: Ensure Three.js modules are properly resolved
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'three': 'three',
        '@react-three/fiber': '@react-three/fiber',
        '@react-three/drei': '@react-three/drei',
      }
    }
    
    // Handle .glb, .gltf files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    })
    
    // Critical: Fix for Vercel deployment
    if (!dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
      }
      
      // Prevent multiple Three.js instances using optimization.splitChunks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three',
              chunks: 'all',
              priority: 10,
              enforce: true,
            },
          },
        },
      }
    }
    
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    
    return config
  },
  // Critical: Output configuration for Vercel
  output: 'standalone',
  // Ensure proper static optimization
  swcMinify: true,
}

export default nextConfig
