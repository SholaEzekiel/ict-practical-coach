/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/academies/word-processing",
        destination: "/subjects/ict/word-processing",
        permanent: false
      },
      {
        source: "/academies/word-processing/lessons/:path*",
        destination: "/subjects/ict/word-processing/intro",
        permanent: false
      }
    ];
  }
};

export default nextConfig;
