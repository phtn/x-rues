import Image from "next/image";
import { useState, useEffect, FC } from "react";
import { Message } from "./types";

export interface Ver {
  encryptedVersions: Record<string, string>;
}
interface ImageMessageProps {
  encryptedImageData: string;
  fileName: string;
  isOwn: boolean;
  senderName: string;
  timestamp: Date;
  decryptMessage: (message: Message | Ver) => Promise<string>;
  currentUserId: string;
}

export const ImageMessage: FC<ImageMessageProps> = ({
  encryptedImageData,
  fileName,
  isOwn,
  senderName,
  decryptMessage,
  timestamp,
  currentUserId,
}) => {
  const [decryptedImageData, setDecryptedImageData] = useState<string>("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [hasDecrypted, setHasDecrypted] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (hasDecrypted || isDecrypting) return;

    let isCancelled = false;

    const decrypt = async () => {
      setIsDecrypting(true);
      try {
        // Create a mock message object for decryption
        const mockMessage = {
          encryptedVersions: { [currentUserId]: encryptedImageData },
        };

        const decryptedData = await decryptMessage(mockMessage);

        if (!isCancelled) {
          if (decryptedData) {
            setDecryptedImageData(decryptedData);
          } else {
            setError("Unable to decrypt image");
          }
          setHasDecrypted(true);
        }
      } catch {
        if (!isCancelled) {
          setError("Failed to decrypt image");
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
    encryptedImageData,
    currentUserId,
    decryptMessage,
    hasDecrypted,
    isDecrypting,
  ]);

  // Don't render if can't decrypt and not own message
  if (!isDecrypting && !decryptedImageData && !error && !isOwn) {
    return null;
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
          padding: "8px",
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
            {senderName}
          </div>
        )}

        <div style={{ marginBottom: "4px" }}>
          {isDecrypting ? (
            <div
              style={{
                width: "200px",
                height: "150px",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontStyle: "italic",
                opacity: 0.75,
              }}
            >
              🔓 Decrypting image...
            </div>
          ) : error ? (
            <div
              style={{
                width: "200px",
                height: "150px",
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.875rem",
                color: "#ef4444",
              }}
            >
              🚫 {error}
            </div>
          ) : decryptedImageData ? (
            <div>
              <Image
                src={decryptedImageData}
                alt={fileName}
                className="h-64 w-auto aspect-auto rounded-lg object-contain"
                height={0}
                width={0}
                unoptimized
                priority
                onError={() => setError("Invalid image data")}
              />
              <div
                style={{
                  fontSize: "0.75rem",
                  marginTop: "4px",
                  opacity: 0.75,
                }}
              >
                📷 {fileName}
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "200px",
                height: "150px",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              📷 Image
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: "0.75rem",
            color: isOwn ? "#dbeafe" : "#6b7280",
          }}
        >
          {timestamp.toLocaleTimeString()}
          {!isOwn && decryptedImageData && (
            <span style={{ marginLeft: "8px" }}>🔓</span>
          )}
        </div>
      </div>
    </div>
  );
};

ImageMessage.displayName = "ImageMessage";
