"use client";

import { PermissionsCtxProvider } from "@/ctx/permissions-ctx";
import { ChatCtxProvider } from "@/ctx/chat-ctx";
import { ChatRoom } from "@/components/chat/room/chat-room";

interface ContentProps {
  roomId: string;
  userId: string;
}

export const Content = ({ roomId, userId }: ContentProps) => {
  return (
    <ChatCtxProvider>
      <PermissionsCtxProvider>
        <ChatRoom roomId={roomId} userId={userId} />
      </PermissionsCtxProvider>
    </ChatCtxProvider>
  );
};
