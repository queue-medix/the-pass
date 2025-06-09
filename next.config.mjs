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
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack: (config, { isServer, dev }) => {
    // Fix Three.js multiple instances warning
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
    
    // Add specific handling for Three.js in production
    if (!dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    
    // Ensure proper module resolution for Three.js
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']
    
    return config
  }
}

export default nextConfig
