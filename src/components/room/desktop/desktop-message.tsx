import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { users } from "../data";
import { MoreHorizontal, Mic } from "lucide-react";
import { Message } from "../types";

interface DesktopMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const DesktopMessage = ({
  message,
  isCurrentUser,
}: DesktopMessageProps) => {
  const sender = users.find((u) => u.id === message.senderId);

  return (
    <div
      className={cn(
        "flex gap-4",
        isCurrentUser ? "justify-end" : "justify-start",
      )}
    >
      {!isCurrentUser && (
        <Avatar className="h-12 w-12 shrink-0 border-2 border-cyber-border">
          <AvatarImage
            src={sender?.avatar || "/rues_v2.svg"}
            alt={sender?.name}
          />
          <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1">
        {!isCurrentUser && (
          <span className="text-sm font-medium text-cyber-text-primary">
            {sender?.name}
          </span>
        )}
        {message.type === "text" && (
          <div
            className={cn(
              "max-w-md p-4 text-base",
              isCurrentUser
                ? "rounded-t-lg rounded-bl-lg rounded-br bg-cyber-blue/30 text-cyber-text-primary border border-cyber-blue/50 shadow-md shadow-cyber-blue/10"
                : "rounded-t-lg rounded-br-lg rounded-bl bg-cyber-card text-cyber-text-primary border border-cyber-border",
            )}
          >
            {message.content}
          </div>
        )}
        {message.type === "image" && (
          <div
            className={cn(
              "max-w-md overflow-hidden border border-cyber-border",
              isCurrentUser
                ? "rounded-t-xl rounded-bl-xl rounded-br-sm"
                : "rounded-t-xl rounded-br-xl rounded-bl-sm",
            )}
          >
            <Image
              src={message.content ?? "/rues_v3.svg"}
              alt="Chat image"
              width={300}
              height={200}
              className="h-auto w-full object-cover"
            />
          </div>
        )}
        {message.type === "audio" && (
          <div
            className={cn(
              "flex items-center gap-3 p-4 text-base",
              isCurrentUser
                ? "rounded-t-xl rounded-bl-xl rounded-br-sm bg-cyber-purple/30 text-cyber-text-primary border border-cyber-purple/50 shadow-md shadow-cyber-purple/10"
                : "rounded-t-xl rounded-br-xl rounded-bl-sm bg-cyber-card text-cyber-text-primary border border-cyber-border",
            )}
          >
            <Mic className="h-6 w-6 text-cyber-green" />
            <span>{message.content}</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-cyber-text-secondary">
              <span>3</span>
              <MoreHorizontal className="h-5 w-5" />
            </div>
          </div>
        )}
      </div>
      {isCurrentUser && (
        <Avatar className="h-12 w-12 shrink-0 border-2 border-cyber-border">
          <AvatarImage
            src={sender?.avatar ?? "/rues_v4.svg"}
            alt={sender?.name}
          />
          <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
