/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br'
    const pdfApiBaseUrl = process.env.PDF_API_URL || 'http://20.65.208.119:5656/api/v1'

    return [
      // Rota específica para PDFs
      {
        source: '/pdf-api/:path*',
        destination: `${pdfApiBaseUrl}/:path*`,
      },
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