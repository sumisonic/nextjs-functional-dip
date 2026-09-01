/**
 * @file Result.ts
 * @description Defines the Result type and its helper functions.
 */
/**
 * A Result is either { success: true, value: T } on success or { success: false, error: E } on failure.
 *
 * @template T Type of the success value
 * @template E Type of the failure error
 */
export type Result<T, E> = { success: true; value: T } | { success: false; error: E }
/**
 * Creates a successful Result.
 *
 * @template T Type of the success value
 * @template E Type of the failure error (defaults to never)
 * @param value The success value
 * @returns A successful Result
 */
export const success = <T, E = never>(value: T): Result<T, E> => ({
  success: true,
  value,
})
/**
 * Creates a failed Result.
 *
 * @template T Type of the success value (never in this case)
 * @template E Type of the failure error
 * @param error The failure error
 * @returns A failed Result
 */
export const failure = <T = never, E = unknown>(error: E): Result<T, E> => ({
  success: false,
  error,
})
/**
 * Checks whether a Result is successful.
 *
 * @template T Type of the success value
 * @template E Type of the failure error
 * @param result The Result to check
 * @returns true if the Result is successful, false otherwise
 */
export const isSuccess = <T, E>(result: Result<T, E>): result is { success: true; value: T } => result.success === true
/**
 * Checks whether a Result is a failure.
 *
 * @template T Type of the success value
 * @template E Type of the failure error
 * @param result The Result to check
 * @returns true if the Result is a failure, false otherwise
 */
export const isFailure = <T, E>(result: Result<T, E>): result is { success: false; error: E } =>
  result.success === false

/**
 * Converts a Promise into a Result (catches the rejection and wraps it as a failure).
 *
 * @template T Type of the success value
 * @template E Type of the error
 * @param promise The asynchronous operation
 * @param onError Converts the caught value into an error
 * @returns A Promise that resolves to a Result
 */
export const fromPromise = async <T, E>(promise: Promise<T>, onError: (e: unknown) => E): Promise<Result<T, E>> => {
  try {
    const value = await promise
    return success(value)
  } catch (e) {
    return failure(onError(e))
  }
}
