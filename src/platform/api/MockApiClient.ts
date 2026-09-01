import type { ApiClient } from './ApiClient'
import { ApiError } from './ApiError'
import type { Request } from './Request'

/**
 * Creates a client that performs no API calls and returns the mock data defined on each Request.
 *
 * The mock passes through the same decodeResponse as production, so a mock that does not match
 * the expected shape is caught here. Meant for development and unit tests, where no real
 * network access is needed.
 */
export const createMockApiClient = (): ApiClient => ({
  request: (async <T, Input = void>(req: Request<T, Input>, input?: Input): Promise<T> => {
    if (req.mock === undefined) {
      throw ApiError.server(404, 'No mock data is defined for this request')
    }
    const data = req.mock((input ?? undefined) as Input)
    if (data === undefined) {
      throw ApiError.server(404, 'Not Found')
    }
    try {
      return req.decodeResponse(data)
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause)
      throw ApiError.decode(message, cause)
    }
  }) as ApiClient['request'],
})
