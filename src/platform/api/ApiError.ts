import { match, P } from 'ts-pattern'

import { DomainError } from '../../domain/common/DomainError'

/**
 * Error type specific to the API layer
 *
 * - network: a network error (connection failure, timeout, ...)
 * - decode: the response could not be decoded (schema validation failed)
 * - server: an error response from the server (4xx, 5xx)
 */
export type ApiError =
  | { type: 'network'; message: string; cause: unknown }
  | { type: 'decode'; message: string; cause: unknown }
  | { type: 'server'; status: number; message: string }

/**
 * Factory for ApiError values
 */
export const ApiError = {
  network: (message: string, cause: unknown): ApiError => ({ type: 'network', message, cause }),
  decode: (message: string, cause: unknown): ApiError => ({ type: 'decode', message, cause }),
  server: (status: number, message: string): ApiError => ({ type: 'server', status, message }),
} as const

/**
 * Type guard for ApiError
 * Checks whether the given cause is an ApiError
 */
export const isApiError = (cause: unknown): cause is ApiError => {
  return (
    typeof cause === 'object' &&
    cause !== null &&
    'type' in cause &&
    ((cause as ApiError).type === 'network' ||
      (cause as ApiError).type === 'decode' ||
      (cause as ApiError).type === 'server')
  )
}

/**
 * Converts an ApiError into a DomainError
 *
 * - network → unexpected (system error)
 * - decode → unexpected (system error)
 * - server 404 → notFound
 * - server 400/422 → validation
 * - server 5xx → unexpected
 *
 * **The argument is `unknown`.** Even when an unexpected value (an exception other than
 * `ApiError`) comes in, it is not swallowed but mapped to `unexpected`, so a DomainError is
 * always returned.
 *
 * @param error The error to convert (not necessarily an `ApiError`)
 * @returns The corresponding DomainError
 */
export const toDomainError = (error: unknown): DomainError =>
  match(error)
    .when(isApiError, (apiError) =>
      match(apiError)
        .with({ type: 'network' }, (network) => DomainError.unexpected(network))
        .with({ type: 'decode' }, (decode) => DomainError.unexpected(decode))
        .with({ type: 'server', status: 404 }, (notFound) => DomainError.notFound(notFound.message))
        .with({ type: 'server', status: P.union(400, 422) }, (invalid) => DomainError.validation(invalid.message))
        .with({ type: 'server' }, (server) => DomainError.unexpected(server))
        .exhaustive(),
    )
    .otherwise((unknownError) => DomainError.unexpected(unknownError))
