/**
 * API Effect Utilities
 * 
 * This file contains utilities for making API requests using Effect.
 * It provides a type-safe way to handle HTTP requests and responses.
 */

import { Effect, pipe } from "effect";

// Define error types for API requests
export class NetworkError extends Error {
  readonly _tag = "NetworkError";
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "NetworkError";
  }
}

export class HttpError extends Error {
  readonly _tag = "HttpError";
  constructor(
    message: string, 
    readonly status: number, 
    readonly statusText: string,
    readonly body?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class ParseError extends Error {
  readonly _tag = "ParseError";
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "ParseError";
  }
}

// Type for API request options
export interface ApiRequestOptions extends RequestInit {
  baseUrl?: string;
  timeout?: number;
}

/**
 * Creates an Effect for making an API request
 * 
 * @param url - The URL to request
 * @param options - Fetch options with additional API-specific options
 * @returns An Effect that resolves to the response data
 */
export function apiEffect<T>(
  url: string,
  options: ApiRequestOptions = {}
): Effect.Effect<T, NetworkError | HttpError | ParseError, never> {
  const { baseUrl = "", timeout = 30000, ...fetchOptions } = options;
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  return pipe(
    // Create a timeout controller
    Effect.sync(() => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      return { controller, timeoutId };
    }),
    
    // Make the fetch request
    Effect.flatMap(({ controller, timeoutId }) => 
      Effect.tryPromise({
        try: () => 
          fetch(fullUrl, {
            ...fetchOptions,
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId)),
        catch: (error) => 
          new NetworkError(
            `Network error while fetching ${fullUrl}: ${String(error)}`,
            error
          )
      })
    ),
    
    // Check for HTTP errors
    Effect.flatMap((response) => {
      if (!response.ok) {
        return Effect.tryPromise({
          try: async () => {
            let errorBody;
            try {
              errorBody = await response.json();
            } catch {
              errorBody = await response.text();
            }
            
            throw new HttpError(
              `HTTP error ${response.status} ${response.statusText}`,
              response.status,
              response.statusText,
              errorBody
            );
          },
          catch: (error) => {
            if (error instanceof HttpError) {
              return error;
            }
            return new HttpError(
              `HTTP error ${response.status} ${response.statusText}`,
              response.status,
              response.statusText
            );
          }
        });
      }
      
      return Effect.succeed(response);
    }),
    
    // Parse the response
    Effect.flatMap((response) => 
      Effect.tryPromise({
        try: () => response.json() as Promise<T>,
        catch: (error) => 
          new ParseError(
            `Error parsing response from ${fullUrl}: ${String(error)}`,
            error
          )
      })
    )
  );
}

/**
 * Creates a typed API client for a specific base URL
 * 
 * @param baseUrl - The base URL for all requests
 * @returns An object with methods for different HTTP verbs
 */
export function createApiClient(baseUrl: string) {
  return {
    get<T>(url: string, options: Omit<ApiRequestOptions, "method" | "body"> = {}) {
      return apiEffect<T>(url, { ...options, method: "GET", baseUrl });
    },
    
    post<T>(url: string, data: unknown, options: Omit<ApiRequestOptions, "method" | "body"> = {}) {
      return apiEffect<T>(url, {
        ...options,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(data),
        baseUrl,
      });
    },
    
    put<T>(url: string, data: unknown, options: Omit<ApiRequestOptions, "method" | "body"> = {}) {
      return apiEffect<T>(url, {
        ...options,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(data),
        baseUrl,
      });
    },
    
    patch<T>(url: string, data: unknown, options: Omit<ApiRequestOptions, "method" | "body"> = {}) {
      return apiEffect<T>(url, {
        ...options,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(data),
        baseUrl,
      });
    },
    
    delete<T>(url: string, options: Omit<ApiRequestOptions, "method" | "body"> = {}) {
      return apiEffect<T>(url, { ...options, method: "DELETE", baseUrl });
    },
  };
}