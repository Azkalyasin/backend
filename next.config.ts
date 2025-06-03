/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.pokemon.com',
        pathname: '/assets/cms2/img/pokedex/full/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
    ],
    // Jika masih ingin tetap pakai domains (opsional):
    domains: ['assets.pokemon.com', 'example.com'],
  },
};

module.exports = nextConfig;
