/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack(config) {
      config.infrastructureLogging = { level: "error" };
      return config;
    },
    images: {
      domains: ['cdn.pixabay.com'],
    },
};

export default nextConfig;
