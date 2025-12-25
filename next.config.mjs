/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. PERFORMANCE: Force SWC Minify (Faster & smaller JS)
  swcMinify: true,

  // 2. PERFORMANCE: Optimize imports for Lucide Icons
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
  },

  // 3. Fixes the Sanity Studio "flushSync" error
  reactStrictMode: false,

  // 4. SECURITY: Hide source maps in production
  productionBrowserSourceMaps: false,

  // 5. PRODUCTION CLEANUP: Remove console.logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 6. IMAGE OPTIMIZATION (Updated)
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // --- ADDED UNSPLASH PERMISSION HERE ---
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // 7. SECURITY HEADERS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // 8. SEO Redirects
  async redirects() {
    return [
      { source: '/heating/furnace-repair', destination: '/heating', permanent: true },
      { source: '/heating/furnace-installation', destination: '/heating', permanent: true },
      { source: '/heating/furnace-maintenance', destination: '/heating', permanent: true },
      { source: '/cooling/air-conditioner-repair', destination: '/cooling', permanent: true },
      { source: '/cooling/air-conditioner-installation', destination: '/cooling', permanent: true },
      { source: '/cooling/air-conditioner-maintenance', destination: '/cooling', permanent: true },
      { source: '/appliances', destination: '/', permanent: true },
      { source: '/summer-offer', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
