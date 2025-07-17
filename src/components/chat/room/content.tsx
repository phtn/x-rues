"use client";

import { PermissionsCtxProvider } from "@/ctx/permissions-ctx";
import { ChatCtxProvider } from "@/ctx/chat-ctx";
import { ChatRoom } from "./chat-room";

interface ContentProps {
  roomId: string;
  userId: string;
}

export const Content = (params: ContentProps) => {
  return (
    <ChatCtxProvider>
      <PermissionsCtxProvider>
        <ChatRoom {...params} />
      </PermissionsCtxProvider>
    </ChatCtxProvider>
  );
};
