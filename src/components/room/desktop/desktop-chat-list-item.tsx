"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface DesktopChatListItemProps {
  chat: {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    avatar: string;
  };
  isActive: boolean;
  onClick: (id: string) => void;
}

export function DesktopChatListItem({
  chat,
  isActive,
  onClick,
}: DesktopChatListItemProps) {
  return (
    <button
      onClick={() => onClick(chat.id)}
      className={cn(
        "flex w-full items-center gap-6 rounded-xl p-4 text-left transition-colors duration-200",
        "border border-transparent", // Base border
        isActive
          ? "bg-cyber-blue/20 border-cyber-blue/50 shadow-lg shadow-cyber-blue/10"
          : "hover:bg-cyber-panel hover:border-cyber-border",
      )}
    >
      <Avatar className="size-12 aspect-square dark:bg-origin border-origin">
        <AvatarImage src={chat.avatar ?? "/rues.svg"} alt={chat.name} />
        <AvatarFallback className="bg-transparent">
          <span className=" font-bold font-sans text-xl text-cyber-text-primary">
            {chat.name.charAt(0)}
          </span>
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-cyber-text-primary">
            {chat.name}
          </h3>
          <span className="text-xs text-cyber-text-secondary">{chat.time}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-cyber-text-secondary">
          <p className="truncate">{chat.lastMessage}</p>
          {chat.unread > 0 && (
            <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-cyber-red text-xs font-bold text-white">
              {chat.unread}
            </span>
          )}
          {chat.lastMessage.includes("pick") && (
            <Icon
              solid
              name="px-paperclip"
              className="ml-2 size-5 text-cyber-text-secondary -rotate-45"
            />
          )}
        </div>
      </div>
    </button>
  );
}
