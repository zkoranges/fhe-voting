import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientProvider from './clientProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FHE Voting',
  description: 'FHE Voting Description Example',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className}`}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  )
}
