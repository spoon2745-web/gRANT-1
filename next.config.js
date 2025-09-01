/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  // Only treat these extensions as pages. This prevents Next.js from resolving .ts/.tsx
  // files as routes which avoids duplicate route warnings while we keep TS backups.
  pageExtensions: ['jsx', 'js', 'mdx'],
  // Enable source maps in production to make runtime stack traces mappable to original files
  productionBrowserSourceMaps: true,
}

module.exports = nextConfig
