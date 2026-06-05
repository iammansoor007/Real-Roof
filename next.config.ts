import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable gzip compression
  compress: true,

  images: {
    // Serve modern formats (AVIF first, WebP fallback)
    formats: ["image/avif", "image/webp"],
    // Good quality with smaller file size
    quality: 80,
    // Aggressive caching - 30 days
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Add aggressive cache headers for static assets
  async headers() {
    return [
      {
        source: '/RealRoof.mp4',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*.{jpg,jpeg,png,webp,avif,svg,ico}',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;