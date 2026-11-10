/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@careconnect/types', '@careconnect/config', '@careconnect/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
