/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["rutik-nft-tradecenter.infura-ipfs.io", "infura-ipfs.io"],
  },
}

module.exports = nextConfig;
