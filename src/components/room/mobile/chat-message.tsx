import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { users } from "../data";

interface ChatMessageProps {
  message: {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    type: "text" | "image" | "audio";
  };
  isCurrentUser: boolean;
}

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const sender = users.find((u) => u.id === message.senderId);

  return (
    <div
      className={cn(
        "flex items-end gap-3",
        isCurrentUser ? "justify-end" : "justify-start",
      )}
    >
      {!isCurrentUser && (
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={sender?.avatar ?? "/rues_v4.svg"}
            alt={sender?.name}
          />
          <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      {message.type === "text" && (
        <div
          className={cn(
            "max-w-[70%] p-4 text-base",
            isCurrentUser
              ? "rounded-t-2xl rounded-bl-2xl rounded-br-md bg-light-purple text-white" // Cyber shape for current user
              : "rounded-t-2xl rounded-br-2xl rounded-bl-md bg-light-grey-bubble text-light-text-primary", // Cyber shape for other user
          )}
        >
          {message.content}
        </div>
      )}
      {message.type === "image" && (
        <div
          className={cn(
            "max-w-[70%] overflow-hidden",
            isCurrentUser
              ? "rounded-t-2xl rounded-bl-2xl rounded-br-md"
              : "rounded-t-2xl rounded-br-2xl rounded-bl-md",
          )}
        >
          <Image
            src={message.content ?? "/rues_v2.svg"}
            alt="Chat image"
            width={150}
            height={150}
            className="h-auto w-full object-cover"
          />
        </div>
      )}
      {isCurrentUser && (
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={sender?.avatar ?? "/rues_v2.svg"}
            alt={sender?.name}
          />
          <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
