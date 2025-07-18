"use client";

import { Room } from "@/components/chat/room";

interface ContentProps {
  roomId: string;
  userId: string;
}

export const Content = ({ roomId, userId }: ContentProps) => {
  return <Room roomId={roomId} userId={userId} />;
};
