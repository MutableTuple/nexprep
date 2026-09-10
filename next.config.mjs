/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.29.101"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // Consolidate SEO authority — variant URLs redirect to the
      // canonical `/millennium-prize-problems` path with a permanent
      // 308 so Google collapses them into one indexed page.
      {
        source: "/7-millennium-problems",
        destination: "/millennium-prize-problems",
        permanent: true,
      },
      {
        source: "/7-millennium-problems/:slug",
        destination: "/millennium-prize-problems/:slug",
        permanent: true,
      },
      {
        source: "/millennium-problems",
        destination: "/millennium-prize-problems",
        permanent: true,
      },
      {
        source: "/millennium-problems/:slug",
        destination: "/millennium-prize-problems/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
