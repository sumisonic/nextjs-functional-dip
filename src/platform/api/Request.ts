/**
 * Associates an HTTP method with its parameters
 */
export type HTTPMethodConfig =
  | { type: 'GET'; params?: Record<string, unknown> }
  | { type: 'POST'; params: unknown }
  | { type: 'PUT'; params: unknown }
  | { type: 'DELETE'; params?: Record<string, unknown> }
  | { type: 'PATCH'; params: unknown }

/**
 * Describes an API request
 * @template T - Type of the response
 * @template Input - Type of the request input (path parameters, body, etc. combined)
 */
export type Request<T, Input = void> = {
  /**
   * Builds the request path
   * @example ({ id }) => `/users/${id}`
   */
  path: (input: Input) => string

  /**
   * Builds the HTTP method and its parameters
   * @example () => ({ type: 'GET', params: { limit: 10 } })
   */
  method: (input: Input) => HTTPMethodConfig

  /**
   * Builds the request headers
   * @example () => ({ 'Authorization': 'Bearer token123' })
   */
  headers?: (input: Input) => Record<string, string>

  /**
   * Decodes the response data.
   * Takes the raw response from the server and converts it into the expected type T.
   * Throws when the conversion is not possible
   * @param response - The raw response from the server
   */
  decodeResponse: (response: unknown) => T

  /**
   * Builds a mock response.
   * MockApiClient passes the return value through decodeResponse before returning it.
   * Returning undefined is treated as "not found" (404)
   */
  mock?: (input: Input) => unknown
}
