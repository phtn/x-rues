/**
 * Retry Policies and Error Handling
 * 
 * This file contains common retry policies and error handling patterns for Effect.
 */

import { Effect, Schedule, Duration } from "effect";
import { NetworkError, HttpError } from "./api";

/**
 * Standard retry policy for network requests
 * - Retries up to 3 times
 * - Uses exponential backoff starting at 500ms
 * - Includes jitter to prevent thundering herd
 * - Maximum delay of 10 seconds
 */
export const standardRetryPolicy = Schedule.exponential(Duration.millis(500), 2.0)
  .pipe(
    Schedule.intersect(Schedule.recurs(3)),
    Schedule.addDelay(() => Duration.millis(Math.random() * 300)),
    Schedule.either(Schedule.spaced(Duration.seconds(10)))
  );

/**
 * Retry policy for idempotent requests (GET, HEAD)
 * - More aggressive retrying (up to 5 times)
 * - Uses exponential backoff starting at 200ms
 */
export const idempotentRetryPolicy = Schedule.exponential(Duration.millis(200), 2.0)
  .pipe(
    Schedule.intersect(Schedule.recurs(5)),
    Schedule.addDelay(() => Duration.millis(Math.random() * 200)),
    Schedule.either(Schedule.spaced(Duration.seconds(15)))
  );

/**
 * Retry policy for non-idempotent requests (POST, PUT, DELETE)
 * - More conservative (only 2 retries)
 * - Longer initial delay (1 second)
 */
export const nonIdempotentRetryPolicy = Schedule.exponential(Duration.seconds(1), 2.0)
  .pipe(
    Schedule.intersect(Schedule.recurs(2)),
    Schedule.addDelay(() => Duration.millis(Math.random() * 500)),
    Schedule.either(Schedule.spaced(Duration.seconds(8)))
  );

/**
 * Determines if an error is retryable
 * 
 * @param error - The error to check
 * @returns True if the error is retryable
 */
export const isRetryableError = (error: unknown): boolean => {
  // Network errors are generally retryable
  if (error instanceof NetworkError) {
    return true;
  }
  
  // Some HTTP status codes are retryable
  if (error instanceof HttpError) {
    // 408 Request Timeout
    // 429 Too Many Requests
    // 5xx Server Errors (except 501 Not Implemented)
    return error.status === 408 || 
           error.status === 429 || 
           (error.status >= 500 && error.status !== 501);
  }
  
  return false;
};

/**
 * Creates a retry policy that only retries on retryable errors
 * 
 * @param policy - The base retry policy
 * @returns A retry policy that only retries on retryable errors
 */
export const retryOnRetryableErrors = <E>(
  policy: Schedule.Schedule<unknown, unknown, unknown>
) => {
  return Schedule.recurWhile<E>((error) => isRetryableError(error)).pipe(
    Schedule.compose(policy)
  );
};

/**
 * Applies the standard retry policy to an Effect
 * 
 * @param effect - The Effect to apply the retry policy to
 * @returns The Effect with the retry policy applied
 */
export const withStandardRetry = <R, E, A>(
  effect: Effect.Effect<R, E, A>
): Effect.Effect<R, E, A> => {
  return effect.pipe(
    Effect.retry(
      Schedule.recurWhile<E>((error) => isRetryableError(error)).pipe(
        Schedule.compose(standardRetryPolicy)
      )
    )
  ) as Effect.Effect<R, E, A>;
};

/**
 * Applies the idempotent retry policy to an Effect
 * 
 * @param effect - The Effect to apply the retry policy to
 * @returns The Effect with the retry policy applied
 */
export const withIdempotentRetry = <R, E, A>(
  effect: Effect.Effect<R, E, A>
): Effect.Effect<R, E, A> => {
  return effect.pipe(
    Effect.retry(
      Schedule.recurWhile<E>((error) => isRetryableError(error)).pipe(
        Schedule.compose(idempotentRetryPolicy)
      )
    )
  ) as Effect.Effect<R, E, A>;
};

/**
 * Applies the non-idempotent retry policy to an Effect
 * 
 * @param effect - The Effect to apply the retry policy to
 * @returns The Effect with the retry policy applied
 */
export const withNonIdempotentRetry = <R, E, A>(
  effect: Effect.Effect<R, E, A>
): Effect.Effect<R, E, A> => {
  return effect.pipe(
    Effect.retry(
      Schedule.recurWhile<E>((error) => isRetryableError(error)).pipe(
        Schedule.compose(nonIdempotentRetryPolicy)
      )
    )
  ) as Effect.Effect<R, E, A>;
};