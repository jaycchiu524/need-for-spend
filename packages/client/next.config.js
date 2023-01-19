const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  // ! This is for tree shaking
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
      preventFullImport: true,
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
      preventFullImport: true,
    },
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
  // rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:8000/:path*',
  //     },
  //   ];
  // }
}

module.exports = withBundleAnalyzer(nextConfig) 
