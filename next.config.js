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
        hostname: 'www.thinkprint.shop',
        port: '',
        pathname: '**',
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
