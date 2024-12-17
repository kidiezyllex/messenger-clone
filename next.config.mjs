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
};

export default nextConfig;
