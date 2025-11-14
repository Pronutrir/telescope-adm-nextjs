/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://servicesapp.pronutrir.com.br'
    const pdfApiBaseUrl = process.env.PDF_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5656/api/v1' : '')

    // Extrair path dinâmico do APITASY da URL do .env
    const apitasyUrl = process.env.NEXT_PUBLIC_APITASY_URL || `${apiBaseUrl}/apitasy`
    let apitasyPath = '/apitasy'
    try {
      const urlObj = new URL(apitasyUrl)
      apitasyPath = urlObj.pathname
    } catch (e) {
      console.warn('⚠️ Erro ao parsear NEXT_PUBLIC_APITASY_URL, usando /apitasy como fallback')
    }

    return [
      // Rota específica para PDFs
      {
        source: '/pdf-api/:path*',
        destination: `${pdfApiBaseUrl}/:path*`,
      },
      // ⚠️ IMPORTANTE: /api/auth/* são rotas LOCAIS (route handlers)
      // NÃO fazer proxy dessas rotas!
      
      // Proxy específico para rotas conhecidas (não usar /api/:path* genérico)
      {
        source: '/api/pacientes/:path*',
        destination: `${apiBaseUrl}/api/pacientes/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${apiBaseUrl}/api/users/:path*`,
      },
      {
        source: '/api/webhook/:path*',
        destination: `${apiBaseUrl}/api/webhook/:path*`,
      },
      {
        source: '/usershield/:path*',
        destination: `${apiBaseUrl}/usershield/:path*`,
      },
      {
        source: `${apitasyPath}/:path*`,
        destination: `${apiBaseUrl}${apitasyPath}/:path*`,
      },
      {
        source: '/notify/:path*',
        destination: `${apiBaseUrl}/notify/:path*`,
      },
      // Rota específica para SignalR Hub
      {
        source: '/signalr/:path*',
        destination: `${apiBaseUrl}${apitasyPath}/:path*`,
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