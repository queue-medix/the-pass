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
  // Remove experimental turbo config that might interfere
  webpack: (config, { isServer, dev }) => {
    // Critical: Ensure Three.js modules are properly resolved
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'three': require.resolve('three'),
        '@react-three/fiber': require.resolve('@react-three/fiber'),
        '@react-three/drei': require.resolve('@react-three/drei'),
      }
      
      // Prevent multiple Three.js instances
      config.resolve.dedupe = ['three', '@react-three/fiber', '@react-three/drei']
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
      
      // Ensure proper module resolution
      config.optimization = {
        ...config.optimization,
        providedExports: false,
        usedExports: false,
        sideEffects: false,
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
