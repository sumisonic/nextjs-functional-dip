/**
 * Error type of the domain layer (independent of any data source)
 *
 * - notFound: the resource does not exist (roughly 404)
 * - validation: the user input is invalid (roughly 400 / 422)
 * - unexpected: a system error (5xx, network, decode, ...)
 */
export type DomainError =
  | { type: 'notFound'; message: string }
  | { type: 'validation'; message: string }
  | { type: 'unexpected'; cause: unknown }

/**
 * Factory for DomainError values
 */
export const DomainError = {
  notFound: (message: string): DomainError => ({ type: 'notFound', message }),
  validation: (message: string): DomainError => ({ type: 'validation', message }),
  unexpected: (cause: unknown): DomainError => ({ type: 'unexpected', cause }),
} as const
