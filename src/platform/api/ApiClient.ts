import type { Request } from './Request'

/**
 * Interface of a client that sends API requests.
 *
 * Executes the given Request and returns the decoded response.
 * Throws an ApiError on failure.
 */
export interface ApiClient {
  /**
   * Performs the API call described by the given Request.
   * The second argument can be omitted when Input is void.
   */
  request: {
    <T>(request: Request<T, void>): Promise<T>
    <T, Input>(request: Request<T, Input>, input: Input): Promise<T>
  }
}
