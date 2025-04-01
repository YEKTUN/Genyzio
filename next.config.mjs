/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack(config) {
      config.infrastructureLogging = { level: "error" };
      return config;
    },
};

export default nextConfig;
