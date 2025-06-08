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
    esmExternals: 'loose'
  },
  webpack: (config) => {
    // Fix Three.js multiple instances warning
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': require.resolve('three'),
      '@react-three/fiber': require.resolve('@react-three/fiber'),
      '@react-three/drei': require.resolve('@react-three/drei'),
    }
    
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    
    return config
  }
}

export default nextConfig
