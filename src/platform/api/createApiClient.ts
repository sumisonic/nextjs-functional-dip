import { match } from 'ts-pattern'

import type { ApiClient } from './ApiClient'
import type { ApiConfig } from './ApiConfig'
import { createMockApiClient } from './MockApiClient'

/**
 * Selects the ApiClient implementation from an ApiConfig
 */
export const createApiClient = (config: ApiConfig): ApiClient =>
  match(config)
    .with({ mode: 'mock' }, () => createMockApiClient())
    .with({ mode: 'live' }, ({ impl }) => impl)
    .exhaustive()
