import type { ApiClient } from './ApiClient'

/**
 * Discriminated union describing how the API client is configured
 *
 * - `mock`: no API calls; returns the mock data defined on each Request
 * - `live`: performs real API calls with the given ApiClient implementation
 */
export type ApiConfig = { mode: 'mock' } | { mode: 'live'; impl: ApiClient }
