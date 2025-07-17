"use client";

import React, { useState, useEffect, memo } from "react";
import { Message } from "./types";
import { ImageMessage, Ver } from "./image-message";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  decryptMessage: (message: Message | Ver) => Promise<string>;
  currentUserId: string;
}

// Message bubble component - memoized to prevent unnecessary re-renders
const MessageBubble = memo(
  ({ message, isOwn, decryptMessage, currentUserId }: MessageBubbleProps) => {
    const [decryptedContent, setDecryptedContent] = useState<string>("");
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [hasDecrypted, setHasDecrypted] = useState(false);

    // For own messages, show content immediately without decryption
    const displayContent = isOwn ? message.content : decryptedContent;

    // Reset state when message ID changes
    useEffect(() => {
      setDecryptedContent("");
      setIsDecrypting(false);
      setHasDecrypted(false);
    }, [message.id]);

    useEffect(() => {
      // Skip decryption for own messages
      if (isOwn) {
        setHasDecrypted(true);
        return;
      }

      // Only decrypt if we haven't already decrypted this message
      if (hasDecrypted || isDecrypting) return;

      let isCancelled = false;

      const decrypt = async () => {
        setIsDecrypting(true);
        try {
          const content = await decryptMessage(message);
          if (!isCancelled) {
            setDecryptedContent(content);
            setHasDecrypted(true);
          }
        } catch (error) {
          console.error("Decryption failed for message:", message.id, error);
          if (!isCancelled) {
            setDecryptedContent("");
            setHasDecrypted(true);
          }
        } finally {
          if (!isCancelled) {
            setIsDecrypting(false);
          }
        }
      };

      decrypt();

      return () => {
        isCancelled = true;
      };
    }, [
      message.id,
      isOwn,
      decryptMessage,
      hasDecrypted,
      isDecrypting,
      message,
    ]); // Add isOwn to dependencies

    // Don't render anything if message can't be decrypted (empty content) and it's not our own message
    if (!isDecrypting && !displayContent && !isOwn && hasDecrypted) {
      return null;
    }

    // Handle image messages differently
    if (message.messageType === "image") {
      // Create a wrapper function for image decryption
      const decryptImageWrapper = async (mockMessage: {
        encryptedVersions: { [key: string]: string };
      }) => {
        // Create a full message object for the decryptMessage function
        const fullMessage: Message = {
          ...message,
          encryptedVersions: mockMessage.encryptedVersions,
        };
        return await decryptMessage(fullMessage);
      };

      return (
        <ImageMessage
          encryptedImageData={
            message.encryptedVersions[currentUserId] || message.content
          }
          fileName={message.fileName ?? "image"}
          isOwn={isOwn}
          senderName={message.senderName}
          timestamp={message.timestamp}
          decryptMessage={decryptImageWrapper}
          currentUserId={currentUserId}
        />
      );
    }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: isOwn ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={{
            maxWidth: "300px",
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: isOwn ? "#3b82f6" : "#475569",
            color: isOwn ? "white" : "#f1f5f9",
          }}
        >
          {!isOwn && (
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: "500",
                marginBottom: "4px",
                opacity: 0.75,
              }}
            >
              {message.senderName}
            </div>
          )}
          <div>
            {isDecrypting ? (
              <span style={{ fontStyle: "italic", opacity: 0.75 }}>
                Decrypting...
              </span>
            ) : (
              displayContent
            )}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              marginTop: "4px",
              color: isOwn ? "#dbeafe" : "#6b7280",
            }}
          >
            {message.timestamp.toLocaleTimeString()}
            {!isOwn && <span style={{ marginLeft: "8px" }}>🔓</span>}
          </div>
        </div>
      </div>
    );
  },
);

MessageBubble.displayName = "MessageBubble";

export { MessageBubble };
