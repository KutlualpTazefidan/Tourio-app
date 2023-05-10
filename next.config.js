/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tourio-58qfouqhw-kutlualptazefidan.vercel.app/",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
