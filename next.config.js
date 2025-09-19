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
      // Rota específica para SignalR Hub
      {
        source: '/signalr/:path*',
        destination: `${apiBaseUrl}/apitasy/:path*`,
      },
    ]
  },
  webpack(config, { isServer }) {
    // Configuração para importar SVG como componentes React
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    // Configuração específica para SignalR no servidor
    if (isServer) {
      // Resolver problemas de importação dinâmica do SignalR
      config.externals = config.externals || []
      config.externals.push({
        '@microsoft/signalr': 'commonjs @microsoft/signalr'
      })

      // Configurações adicionais para Node.js
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "fs": false,
        "net": false,
        "tls": false,
        "crypto": false,
      }
    }

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