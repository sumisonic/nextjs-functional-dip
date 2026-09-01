import type { Metadata } from 'next'
import * as React from 'react'

import { Providers } from './providers'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'nextjs-functional-dip',
    template: '%s | nextjs-functional-dip',
  },
  description: 'A sample of a lightweight, function-based layered architecture with DIP applied at one boundary',
}

export type RootLayoutProps = {
  children: React.ReactNode
}

/**
 * Root layout
 *
 * Mounts the client-side composition root (providers.tsx) here.
 */
const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
