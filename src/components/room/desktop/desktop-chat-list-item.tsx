"use client";
import { CyberAvatar } from "@/components/avatar-gen/gen";
import { TypingIndicator } from "@/components/e8";
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
      <div className="size-12 rounded-lg flex items-center justify-center overflow-hidden">
        <CyberAvatar publicKey={chat.name} className="scale-[40%]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-lg text-cyber-text-primary">
              {chat.name}
            </h3>
            {/* <span>{chat.id}</span> */}
            {chat.id === "c1" && <TypingIndicator />}
          </div>
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
