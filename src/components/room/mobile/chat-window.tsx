"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, ChevronLeft } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { users, chatMessages } from "../data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar"; // Import useSidebar

interface ChatWindowProps {
  selectedChatId: string;
}

export const MobileWindow = ({ selectedChatId }: ChatWindowProps) => {
  const currentChatUser = users.find((u) => u.id === selectedChatId);
  const currentUser = users[0]; // Pedrik Ronner is the current user for light mode example
  const { toggleSidebar } = useSidebar(); // Use the toggleSidebar hook

  if (!currentChatUser) {
    return (
      <div className="flex h-full items-center justify-center">
        Select a chat to start messaging.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-light-card shadow-lg">
      <div className="flex items-center justify-between rounded-t-2xl bg-light-purple-light p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <ChevronLeft className="h-6 w-6 text-light-text-primary" />
          </Button>
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={currentChatUser.avatar || "/placeholder.svg"}
              alt={currentChatUser.name}
            />
            <AvatarFallback>{currentChatUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="font-semibold text-light-text-primary">
              {currentChatUser.name}
            </h2>
            <div className="flex items-center gap-1 text-sm text-light-text-secondary">
              <span className="h-2 w-2 rounded-full bg-light-purple" />
              <span>Active now</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full text-light-text-primary"
        >
          <Phone className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          <div className="text-center text-xs text-light-text-secondary">
            28 July 2023
          </div>
          {chatMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUser.id}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="p-4">
        <ChatInput />
      </div>
    </div>
  );
};
