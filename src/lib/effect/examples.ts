/**
 * Effect Examples
 * 
 * This file contains examples of how to use the Effect utilities.
 * These are for demonstration purposes and not meant to be used in production.
 */

import { Effect, pipe } from "effect";
import { apiEffect, NetworkError, HttpError, ParseError } from "./api";
import { withStandardRetry, withIdempotentRetry } from "./retry";
import { Message, validateMessage, sendMessage, sendMessageWithFallback } from "./message";

// Example: Basic API request with Effect
export const fetchUserExample = (userId: string) => {
  return apiEffect<{ id: string; name: string; email: string }>(
    `/api/users/${userId}`
  );
};

// Example: API request with retry
export const fetchUserWithRetryExample = (userId: string) => {
  return pipe(
    apiEffect<{ id: string; name: string; email: string }>(
      `/api/users/${userId}`
    ),
    withIdempotentRetry
  );
};

// Example: Error handling with Effect
export const fetchUserWithErrorHandlingExample = (userId: string) => {
  return pipe(
    apiEffect<{ id: string; name: string; email: string }>(
      `/api/users/${userId}`
    ),
    Effect.catchTag("NetworkError", (error: NetworkError) => 
      Effect.logError(`Network error: ${error.message}`).pipe(
        Effect.flatMap(() => Effect.fail(new Error("Failed to connect to server")))
      )
    ),
    Effect.catchTag("HttpError", (error: HttpError) => {
      if (error.status === 404) {
        return Effect.fail(new Error(`User ${userId} not found`));
      }
      return Effect.fail(new Error(`Server error: ${error.status} ${error.statusText}`));
    }),
    Effect.catchTag("ParseError", (error: ParseError) => 
      Effect.fail(new Error(`Failed to parse server response: ${error.message}`))
    )
  );
};

// Example: Composing multiple API requests
export const fetchUserAndPostsExample = (userId: string) => {
  const fetchUser = apiEffect<{ id: string; name: string }>(
    `/api/users/${userId}`
  );
  
  const fetchPosts = (user: { id: string }) => 
    apiEffect<Array<{ id: string; title: string }>>(
      `/api/users/${user.id}/posts`
    );
  
  return pipe(
    fetchUser,
    Effect.flatMap(user => 
      pipe(
        fetchPosts(user),
        Effect.map(posts => ({ user, posts }))
      )
    ),
    withStandardRetry
  );
};

// Example: Running an Effect
export const runEffectExample = async () => {
  try {
    const result = await Effect.runPromise(fetchUserExample("123"));
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Example: Message validation with Effect
export const validateMessageExample = (messageData: unknown) => {
  return validateMessage(messageData);
};

// Example: Sending a message with Effect
export const sendMessageExample = (userId: string, roomId: string, content: string) => {
  const message: Message = {
    id: crypto.randomUUID(),
    userId,
    roomId,
    content,
    timestamp: Date.now(),
    type: "text"
  };
  
  return sendMessage(message);
};

// Example: Sending a message with fallback
export const sendMessageWithFallbackExample = (userId: string, roomId: string, content: string) => {
  const message: Message = {
    id: crypto.randomUUID(),
    userId,
    roomId,
    content,
    timestamp: Date.now(),
    type: "text"
  };
  
  return pipe(
    sendMessageWithFallback(message),
    Effect.map(result => {
      if (result.status === "sent") {
        console.log("Message sent successfully");
      } else {
        console.log("Message queued for later retry");
      }
      return result;
    })
  );
};