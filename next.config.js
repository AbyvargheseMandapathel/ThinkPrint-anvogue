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
        ],
      },
    reactStrictMode: true,
}

module.exports = nextConfig
