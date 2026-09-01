import type { ApiClient } from './ApiClient'
import { ApiError } from './ApiError'
import type { Request } from './Request'

/**
 * Options for {@link createFetchApiClient}.
 *
 * Lets you **inject things like auth headers once, when the ApiClient is created**.
 * Secrets (API keys, etc.) stay out of the Request definitions and are injected centrally here.
 */
export type FetchApiClientOptions = {
  /** Default headers added to every request (merged after the Request's own headers, so they win) */
  readonly defaultHeaders?: Record<string, string>
}

/**
 * Factory that creates a fetch-based ApiClient implementation
 * @param baseUrl - Base URL of the API
 * @param options - Central injection settings such as default headers
 */
export const createFetchApiClient = (baseUrl: string, options: FetchApiClientOptions = {}): ApiClient => ({
  request: (async <T, Input = void>(req: Request<T, Input>, input?: Input): Promise<T> => {
    const inputValue = (input ?? undefined) as Input
    const methodConfig = req.method(inputValue)

    // GET/DELETE send params as a query string; everything else sends them as a JSON body
    const isQueryMethod = methodConfig.type === 'GET' || methodConfig.type === 'DELETE'

    const headers = {
      // Content-Type only on methods that send a body (on GET it triggers a needless CORS preflight)
      ...(isQueryMethod ? {} : { 'Content-Type': 'application/json' }),
      ...(req.headers ? req.headers(inputValue) : {}),
      // Default headers are merged last so the central injection always wins
      ...(options.defaultHeaders ?? {}),
    }
    const query =
      isQueryMethod && methodConfig.params
        ? `?${new URLSearchParams(methodConfig.params as Record<string, string>)}`
        : ''
    const body = isQueryMethod ? undefined : JSON.stringify(methodConfig.params)

    const url = `${baseUrl}${req.path(inputValue)}${query}`

    const response = await fetch(url, { method: methodConfig.type, headers, body }).catch((cause: unknown) => {
      // Network error (connection failure, DNS resolution failure, ...)
      const message = cause instanceof Error ? cause.message : String(cause)
      throw ApiError.network(message, cause)
    })

    if (!response.ok) {
      // Error response from the server (4xx, 5xx)
      throw ApiError.server(response.status, response.statusText)
    }

    const data: unknown = await response.json().catch((cause: unknown) => {
      const message = cause instanceof Error ? cause.message : String(cause)
      throw ApiError.decode(message, cause)
    })

    try {
      return req.decodeResponse(data)
    } catch (cause) {
      // Decode error (the response does not match the expected shape)
      const message = cause instanceof Error ? cause.message : String(cause)
      throw ApiError.decode(message, cause)
    }
  }) as ApiClient['request'],
})
