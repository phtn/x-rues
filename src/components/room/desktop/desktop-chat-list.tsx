"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DesktopChatListItem } from "./desktop-chat-list-item";
import { desktopChatList } from "../data";
import { Icon } from "@/lib/icons";

interface DesktopChatListProps {
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
}

export function DesktopChatList({
  selectedChatId,
  onSelectChat,
}: DesktopChatListProps) {
  return (
    <>
      <div className="flex relative h-16 border-b">
        <Icon
          solid
          name="rues-chat-logo"
          className="size-4 md:size-4 text-slate-400 mb-4"
        />
        <h1 className="font-mono dark:text-neutral-400 font-light text-lg md:text-xl">
          rues
        </h1>
      </div>

      <div className="h-16 flex items-center justify-between px-2">
        <h2 className="text-xl font-space font-semibold tracking-tight text-indigo-300">
          Trusted
        </h2>
        <div className="flex items-center gap-2 text-base text-cyber-text-secondary">
          <Icon
            solid
            name="px-user"
            className="size-4 md:size-5 text-slate-400"
          />
          <span className="font-space text-cyber-text-secondary">45</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {desktopChatList.map((chat) => (
          <DesktopChatListItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === selectedChatId}
            onClick={onSelectChat}
          />
        ))}
      </div>
    </>
  );
}

export const SearchChat = () => (
  <div className="relative h-16 border-b">
    <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-cyber-text-secondary" />
    <Input
      placeholder="Search"
      className="w-full rounded-xl border border-cyber-border bg-cyber-card h-12 py-3 pl-12 text-cyber-text-primary placeholder:text-cyber-text-secondary focus-visible:ring-2 focus-visible:ring-cyber-blue focus-visible:ring-offset-0"
    />
  </div>
);
