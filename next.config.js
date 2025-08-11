/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://servicesapp.pronutrir.com.br/:path*',
      },
      {
        source: '/usershield/:path*',
        destination: 'https://servicesapp.pronutrir.com.br/usershield/:path*',
      },
      {
        source: '/apitasy/:path*',
        destination: 'https://servicesapp.pronutrir.com.br/apitasy/:path*',
      },
      {
        source: '/notify/:path*',
        destination: 'https://servicesapp.pronutrir.com.br/notify/:path*',
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