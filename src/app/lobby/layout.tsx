"use client";

import { PermissionsCtxProvider } from "@/ctx/permissions-ctx";
import { ChatCtxProvider } from "@/ctx/chat-ctx";
import { ReactNode } from "react";

export default function LobbyLayout({ children }: { children: ReactNode }) {
  return (
    <ChatCtxProvider>
      <PermissionsCtxProvider>{children}</PermissionsCtxProvider>
    </ChatCtxProvider>
  );
}
