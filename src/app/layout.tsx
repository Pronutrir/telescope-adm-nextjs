import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { themeScript } from '@/lib/theme-script'
import './globals.css'

const inter = Inter({ subsets: [ 'latin' ] })

export const metadata: Metadata = {
  title: 'Telescope ADM',
  description: 'Sistema de gerenciamento',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preload" as="image" href="/backgrounds/galaxy.webp" type="image/webp" />
      </head>
      <body className={`${inter.className} transition-colors duration-200`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
