"use client";

import { PermissionsCtxProvider } from "@/ctx/permissions";
import { ChatRoom } from "./chat-room";

export const Content = () => {
  return (
    <PermissionsCtxProvider>
      <ChatRoom />
    </PermissionsCtxProvider>
  );
};
