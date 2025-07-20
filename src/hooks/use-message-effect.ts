/**
 * Message Effect Hook
 * 
 * This hook provides a way to send messages using Effect in React components.
 */

import { useState, useCallback, useEffect } from "react";
import { Effect } from "effect";
import { 
  Message, 
  sendMessageWithFallback, 
  ValidationError,
  retrySendingPendingMessages,
  getPendingMessages
} from "@/lib/effect/message";

interface UseMessageEffectOptions {
  onSuccess?: (message: Message) => void;
  onError?: (error: ValidationError) => void;
  onQueued?: (message: Message) => void;
  autoRetryInterval?: number; // in milliseconds
}

export function useMessageEffect(options: UseMessageEffectOptions = {}) {
  const { 
    onSuccess, 
    onError, 
    onQueued,
    autoRetryInterval = 30000 // Default to 30 seconds
  } = options;
  
  const [isSending, setIsSending] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  
  // Load initial pending count
  useEffect(() => {
    Effect.runPromise(getPendingMessages())
      .then(messages => setPendingCount(messages.length))
      .catch(console.error);
  }, []);
  
  // Set up auto-retry if enabled
  useEffect(() => {
    if (autoRetryInterval <= 0) return;
    
    const intervalId = setInterval(() => {
      if (pendingCount > 0) {
        Effect.runPromise(retrySendingPendingMessages())
          .then(sentCount => {
            if (sentCount > 0) {
              // Update pending count
              Effect.runPromise(getPendingMessages())
                .then(messages => setPendingCount(messages.length))
                .catch(console.error);
            }
          })
          .catch(console.error);
      }
    }, autoRetryInterval);
    
    return () => clearInterval(intervalId);
  }, [autoRetryInterval, pendingCount]);
  
  // Function to send a message
  const sendMessage = useCallback((message: Omit<Message, "id" | "timestamp" | "type"> & { type?: Message["type"] }) => {
    // Create a complete message object
    const completeMessage: Message = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: "text",
      ...message
    };
    
    setIsSending(true);
    
    // Run the Effect
    Effect.runPromise(sendMessageWithFallback(completeMessage))
      .then(result => {
        if (result.status === "sent") {
          onSuccess?.(result.message);
        } else {
          onQueued?.(result.message);
          setPendingCount(prev => prev + 1);
        }
      })
      .catch(error => {
        if (error instanceof ValidationError) {
          onError?.(error);
        } else {
          console.error("Unexpected error:", error);
        }
      })
      .finally(() => {
        setIsSending(false);
      });
  }, [onSuccess, onError, onQueued]);
  
  // Function to manually retry sending pending messages
  const retryPendingMessages = useCallback(() => {
    return Effect.runPromise(retrySendingPendingMessages())
      .then(sentCount => {
        // Update pending count
        return Effect.runPromise(getPendingMessages())
          .then(messages => {
            setPendingCount(messages.length);
            return sentCount;
          });
      });
  }, []);
  
  return {
    sendMessage,
    isSending,
    pendingCount,
    retryPendingMessages
  };
}