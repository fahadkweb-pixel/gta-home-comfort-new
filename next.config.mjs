/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Fixes the Sanity Studio "flushSync" error
  reactStrictMode: false,

  // 2. Allows images from Sanity to load
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  // 3. SEO Redirects (Old Site -> New Structure)
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
