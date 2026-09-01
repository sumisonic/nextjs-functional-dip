import type { NextConfig } from 'next'

/**
 * ⚠ Anything placed in `env:{}` is **always inlined into the client JS bundle**,
 *   with or without the NEXT_PUBLIC_ prefix (documented Next.js behavior).
 *   Never put secrets (API keys, etc.) here.
 *   API_BASE_URL in this sample is a public value the browser calls directly, so inlining it is fine.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL ?? '',
  },
}

export default nextConfig
