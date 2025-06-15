/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
        // Existing pattern
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
      ],
    },
  reactStrictMode: true,
}

module.exports = nextConfig;