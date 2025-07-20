import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DesktopMessage } from "./desktop-message";
import { DesktopChatInput } from "./desktop-chat-input";
import { users, desktopChatMessages } from "../data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DesktopWindowProps {
  selectedChatId: string | null;
  isChatDetailsCollapsed: boolean;
}

export const DesktopWindow = ({
  selectedChatId,
  isChatDetailsCollapsed,
}: DesktopWindowProps) => {
  const currentChatUser = users.find((u) => u.id === selectedChatId);
  const currentUser = users[5]; // Harry Fettel is the current user for dark mode example

  if (!currentChatUser) {
    return (
      <div className="flex h-full items-center justify-center text-cyber-text-secondary">
        Select a chat to start messaging.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-cyber-panel/50">
      <div className="flex items-center justify-between border-b border-cyber-border p-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-cyber-border">
            <AvatarImage
              src={currentChatUser.avatar ?? "/rues.svg"}
              alt={currentChatUser.name}
            />
            <AvatarFallback>{currentChatUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-lg tracking-tight font-semibold text-cyber-text-primary/80">
              {currentChatUser.name}
            </h2>
            <div className="flex items-center gap-1 text-sm text-cyber-text-secondary">
              <span className="size-2 rounded-full bg-cyber-green shadow-[0_0_6px_rgba(0,255,0,0.6)]" />
              <span className="font-space text-cyber-text-secondary font-light">
                Online
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center w-12 gap-5 text-cyber-text-secondary"></div>
      </div>

      <ScrollArea className="flex-1 p-6 md:min-h-[calc(100vh-180px)]">
        <div className="flex flex-col gap-5">
          {desktopChatMessages.map((message) => (
            <DesktopMessage
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUser?.id}
            />
          ))}
        </div>
      </ScrollArea>

      <div className={cn("py-6 px-20", { " px-40": isChatDetailsCollapsed })}>
        <DesktopChatInput />
      </div>
    </div>
  );
};
