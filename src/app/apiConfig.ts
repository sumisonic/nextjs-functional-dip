import type { ApiConfig } from '../platform/api/ApiConfig'
import { createFetchApiClient } from '../platform/api/FetchApiClient'

/**
 * Builds the ApiConfig from environment variables.
 *
 * - `NEXT_PUBLIC_MOCK=true`: MockApiClient (no API calls)
 * - otherwise: the fetch implementation (talks to `API_BASE_URL`)
 *
 * `API_BASE_URL` is a public value that next.config.ts also inlines into the client JS via `env`.
 * Used by both composition roots: the server (SSG) and the client.
 */
export const getApiConfig = (): ApiConfig =>
  process.env.NEXT_PUBLIC_MOCK === 'true'
    ? { mode: 'mock' }
    : { mode: 'live', impl: createFetchApiClient(process.env.API_BASE_URL ?? '') }
