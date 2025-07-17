"use client";

import { PermissionsCtxProvider } from "@/ctx/permissions-ctx";
import { ChatRoom } from "./chat-room";

export const Content = () => {
  return (
    <PermissionsCtxProvider>
      <ChatRoom />
    </PermissionsCtxProvider>
  );
};
