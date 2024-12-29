/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "utfs.io",
      "static.designboom.com",
      "res.cloudinary.com",
      "benhvienjw.vn",
      "upload.wikimedia.org",
      "https://zalo-api.zadn.vn",
      "unsplash.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    loader: "custom",
    loaderFile: "./image-loader.js",
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        cacheGroups: {
          default: false,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
