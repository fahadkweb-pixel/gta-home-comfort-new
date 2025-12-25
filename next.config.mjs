/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Fixes the Sanity Studio "flushSync" error
  reactStrictMode: false,

  // 2. SECURITY: Hide source maps in production (prevents code inspection)
  productionBrowserSourceMaps: false,

  // 3. Allows images from Sanity to load
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  // 4. SECURITY HEADERS (The "Helmet")
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
            value: 'SAMEORIGIN', // Blocks your site from being embedded in iframes (Clickjacking protection)
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

  // 5. SEO Redirects (Preserved from your previous config)
  async redirects() {
    return [
      // HEATING CONSOLIDATION
      { source: '/heating/furnace-repair', destination: '/heating', permanent: true },
      { source: '/heating/furnace-installation', destination: '/heating', permanent: true },
      { source: '/heating/furnace-maintenance', destination: '/heating', permanent: true },

      // COOLING CONSOLIDATION
      { source: '/cooling/air-conditioner-repair', destination: '/cooling', permanent: true },
      { source: '/cooling/air-conditioner-installation', destination: '/cooling', permanent: true },
      { source: '/cooling/air-conditioner-maintenance', destination: '/cooling', permanent: true },

      // GENERAL CLEANUP
      { source: '/appliances', destination: '/', permanent: true },
      { source: '/summer-offer', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
