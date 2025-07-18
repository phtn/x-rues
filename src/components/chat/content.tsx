"use client";

import { PermissionsCtxProvider } from "@/ctx/permissions-ctx";
import { ChatCtxProvider } from "@/ctx/chat-ctx";
import { ChatRoom } from "./chat-room";

export const Content = () => {
  return (
    <ChatCtxProvider>
      <PermissionsCtxProvider>
        <ChatRoom />
      </PermissionsCtxProvider>
    </ChatCtxProvider>
  );
};
