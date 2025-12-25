export default function robots() {
  const baseUrl = 'https://www.gtahomecomfort.com'; // CHANGE THIS to your real domain when live

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/studio'], // Keep Google out of the CMS
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
