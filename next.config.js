/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    const apiBaseUrl = process.env.API_BASE_URL || 'https://servicesapp.pronutrir.com.br'

    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
      {
        source: '/usershield/:path*',
        destination: `${apiBaseUrl}/usershield/:path*`,
      },
      {
        source: '/apitasy/:path*',
        destination: `${apiBaseUrl}/apitasy/:path*`,
      },
      {
        source: '/notify/:path*',
        destination: `${apiBaseUrl}/notify/:path*`,
      },
    ]
  },
  webpack(config) {
    // Configuração para importar SVG como componentes React
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  },
  compiler: {
    emotion: true,
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
}

module.exports = nextConfig