"use client";

import { PermissionsCtxProvider } from "@/ctx/permissions-ctx";
import { Lobby } from "./lobby";
import { ChatCtxProvider } from "@/ctx/chat-ctx";

export const Content = () => {
  return (
    <ChatCtxProvider>
      <PermissionsCtxProvider>
        <Lobby />
      </PermissionsCtxProvider>
    </ChatCtxProvider>
  );
};
