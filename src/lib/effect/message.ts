/**
 * Message Handling with Effect
 *
 * This file contains Effect-based utilities for handling chat messages,
 * including validation, sending, and error handling.
 */

import { Effect, pipe } from "effect";
import { apiEffect, NetworkError, HttpError } from "./api";
import { withNonIdempotentRetry } from "./retry";

// Define message-specific error types
export class ValidationError extends Error {
  readonly _tag = "ValidationError";
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class MessageSendError extends Error {
  readonly _tag = "MessageSendError";
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "MessageSendError";
  }
}

// Define message types
export interface Message {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  timestamp: number;
  type: "text" | "image" | "system";
}

/**
 * Validates a message object
 *
 * @param message - The message to validate
 * @returns An Effect that resolves to the validated message
 */
export const validateMessage = (
  message: unknown,
): Effect.Effect<Message, ValidationError, never> => {
  return Effect.try({
    try: () => {
      // Check if message is an object
      if (typeof message !== "object" || message === null) {
        throw new ValidationError("Message must be an object");
      }

      const msg = message as Partial<Message>;

      // Validate required fields
      if (!msg.content || typeof msg.content !== "string") {
        throw new ValidationError("Message must have content as string");
      }

      if (!msg.userId || typeof msg.userId !== "string") {
        throw new ValidationError("Message must have userId as string");
      }

      if (!msg.roomId || typeof msg.roomId !== "string") {
        throw new ValidationError("Message must have roomId as string");
      }

      // Validate message type
      if (msg.type && !["text", "image", "system"].includes(msg.type)) {
        throw new ValidationError(
          "Message type must be 'text', 'image', or 'system'",
        );
      }

      // Return validated message with defaults for optional fields
      return {
        id: msg.id || crypto.randomUUID(),
        content: msg.content,
        userId: msg.userId,
        roomId: msg.roomId,
        timestamp: msg.timestamp || Date.now(),
        type: msg.type || "text",
      } as Message;
    },
    catch: (error) => {
      if (error instanceof ValidationError) {
        return error;
      }
      return new ValidationError(`Unknown validation error: ${String(error)}`);
    },
  });
};

/**
 * Sends a message to the server
 *
 * @param message - The message to send
 * @returns An Effect that resolves when the message is sent
 */
// declare type SendMessage = Effect.Effect<
//   never,
//   ValidationError | NetworkError | HttpError | MessageSendError,
//   never
// >;
type MessageErrors =
  | ValidationError
  | NetworkError
  | HttpError
  | MessageSendError;
export const sendMessage = (
  message: Message,
): Effect.Effect<void, MessageErrors, never> => {
  return pipe(
    // First validate the message
    validateMessage(message),

    // Then send it to the server
    Effect.flatMap((validatedMessage) =>
      apiEffect<{ success: boolean }>("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedMessage),
      }),
    ),

    // Apply retry policy for failed sends
    withNonIdempotentRetry,

    // Map the response to void
    Effect.map(() => undefined),

    Effect.catchAll((err): Effect.Effect<never, MessageErrors, never> => {
      // If it's already a ValidationError, just pass it through
      if (err instanceof ValidationError) {
        return Effect.fail(err);
      }

      // If it's a NetworkError or HttpError, pass it through
      if (err instanceof NetworkError || err instanceof HttpError) {
        return Effect.fail(err as NetworkError);
      }

      // Otherwise, wrap it in a MessageSendError
      return Effect.fail(
        new MessageSendError(`Failed to send message: ${String(err)}`, err),
      );
    }),
  );
};

/**
 * Stores a message locally for later retry
 *
 * @param message - The message to store
 * @returns An Effect that resolves when the message is stored
 */
export const storeMessageForRetry = (
  message: Message,
): Effect.Effect<void, never, never> => {
  return Effect.sync(() => {
    const pendingMessages = JSON.parse(
      localStorage.getItem("pendingMessages") || "[]",
    );
    pendingMessages.push(message);
    localStorage.setItem("pendingMessages", JSON.stringify(pendingMessages));
  });
};

/**
 * Retrieves pending messages stored locally
 *
 * @returns An Effect that resolves to an array of pending messages
 */
export const getPendingMessages = (): Effect.Effect<
  Message[],
  never,
  never
> => {
  return Effect.sync(() => {
    const pendingMessages = JSON.parse(
      localStorage.getItem("pendingMessages") || "[]",
    );
    return pendingMessages as Message[];
  });
};

/**
 * Removes a message from the pending messages
 *
 * @param messageId - The ID of the message to remove
 * @returns An Effect that resolves when the message is removed
 */
export const removePendingMessage = (
  messageId: string,
): Effect.Effect<void, never, never> => {
  return Effect.sync(() => {
    const pendingMessages = JSON.parse(
      localStorage.getItem("pendingMessages") || "[]",
    );
    const filteredMessages = pendingMessages.filter(
      (msg: Message) => msg.id !== messageId,
    );
    localStorage.setItem("pendingMessages", JSON.stringify(filteredMessages));
  });
};

/**
 * Sends a message with fallback to local storage if it fails
 *
 * @param message - The message to send
 * @returns An Effect that resolves to the send status
 */
export const sendMessageWithFallback = (
  message: Message,
): Effect.Effect<
  { status: "sent" | "queued"; message: Message },
  ValidationError,
  never
> => {
  return pipe(
    sendMessage(message),
    Effect.map(() => ({ status: "sent" as const, message })),
    Effect.catchTag("ValidationError", (error) => Effect.fail(error)),
    Effect.catchAll((error) => {
      // Log the error
      console.error("Failed to send message:", error);

      // Store the message for later retry
      return pipe(
        storeMessageForRetry(message),
        Effect.map(() => ({ status: "queued" as const, message })),
      );
    }),
  );
};

/**
 * Retries sending all pending messages
 *
 * @returns An Effect that resolves to the number of successfully sent messages
 */
export const retrySendingPendingMessages = (): Effect.Effect<
  number,
  never,
  never
> => {
  return pipe(
    getPendingMessages(),
    Effect.flatMap((messages) => {
      if (messages.length === 0) {
        return Effect.succeed(0);
      }

      // Try to send each message
      const sendEffects = messages.map((message) =>
        pipe(
          sendMessage(message),
          Effect.map(() => message.id),
          Effect.catchAll(() => Effect.succeed(null)),
        ),
      );

      return pipe(
        Effect.all(sendEffects),
        Effect.flatMap((results) => {
          // Filter out null results (failed sends)
          const successfulIds = results.filter(Boolean) as string[];

          // Remove successful messages from pending
          return pipe(
            Effect.forEach(successfulIds, removePendingMessage),
            Effect.map(() => successfulIds.length),
          );
        }),
      );
    }),
  );
};
