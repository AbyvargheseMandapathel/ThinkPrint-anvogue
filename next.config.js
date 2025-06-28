/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zqwkdm0dqllxqofj.public.blob.vercel-storage.com',
        port: '',
        pathname: '/categories/**',
      },
      {
        protocol: 'https',
        hostname: 'imagesm.plexussquare.in',
        port: '',
        pathname: '**',
      },
      
      {
        protocol: 'https',
        hostname: 'thinkprint-react.vercel.app',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'anvogue.vercel.app',
        port: '',
        pathname: '**',
      },
      
      {
        protocol: 'https',
        hostname: 'www.thinkprint.shop',
        port: '',
        pathname: '**',
      },
      
      {
        protocol: 'https',
        hostname: 'cdn.thinkprint.shop',
        port: '',
        pathname: '/media/**', 
      },
    ],
  },
  reactStrictMode: true,
  typescript: {
    // ✅ Ignore type errors during build (use with caution)
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
