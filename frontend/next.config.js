/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
    NEXT_PUBLIC_FRONT_API_KEY: process.env.NEXT_PUBLIC_FRONT_API_KEY,
  },
}

module.exports = nextConfig
