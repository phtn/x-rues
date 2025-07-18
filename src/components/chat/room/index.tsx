"use client";

import { Button } from "@/components/ui/button";
import { useChatCtx } from "@/ctx/chat-ctx";
import { usePermissionsCtx } from "@/ctx/permissions-ctx";
import { Icon } from "@/lib/icons";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { PermissionsModal } from "../permissions";
import { Message, type User } from "../types";
import { RoomHeader } from "./header";
import { MessageCtrl } from "./message-ctrl";
import { MessageWindow } from "./message-window";
import { Messages } from "./messages";
import { IOriginalSidebar } from "./original-sidebar";
import { Ver } from "../image-message";

interface RoomProps {
  roomId: string;
  userId: string;
}

export const Room = ({ roomId, userId }: RoomProps) => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentUser,
    joinRoom,
    isLoading,
    error,
    onLogout,
    setActiveRoom,
    loadRoomsAndMessages,
    chatRooms,
  } = useChatCtx();

  const { withPermission, selectedUser, onUserSelect, showPermissionsModal } =
    usePermissionsCtx();

  // Set active room and join it
  useEffect(() => {
    if (roomId) {
      // Set active room immediately to avoid dependency on currentUser
      setActiveRoom(roomId);

      // Only attempt to join room if user is logged in
      if (currentUser) {
        joinRoom(roomId);
      }
    }
  }, [currentUser, roomId, setActiveRoom, joinRoom]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatRooms]);

  // Load rooms and messages when user logs in
  useEffect(() => {
    let counter = 0;
    if (currentUser) {
      loadRoomsAndMessages(userId);
      // Poll for updates every 2 seconds
      const interval = setInterval(loadRoomsAndMessages, 2000);
      console.log((counter += 1));
      return () => clearInterval(interval);
    }
  }, [currentUser, loadRoomsAndMessages, userId]);

  // Redirect to lobby if not authenticated
  useEffect(() => {
    if (!userId && !isLoading) {
      router.push("/lobby");
    }
  }, [userId, isLoading, router]);

  // Find active room data with null check
  const activeRoomData = roomId
    ? chatRooms.find((r) => r.id === roomId)
    : undefined;

  const handleBackToRooms = useCallback(() => {
    router.push(`/lobby/${userId}/rooms`);
  }, [router, userId]);

  const notSelf = useCallback(
    (user: User) => currentUser && user.id !== currentUser.id,
    [currentUser],
  );

  const sidebarProps = useMemo(
    () => ({
      creator: activeRoomData?.creatorId,
      members: activeRoomData?.members.filter(notSelf) as User[],
      withPermission,
      onMemberSelect: onUserSelect,
    }),
    [activeRoomData, withPermission, notSelf, onUserSelect],
  );

  if (!currentUser && sidebarProps) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full size-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!activeRoomData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon
            solid
            name="px-chat"
            className="size-10 mx-auto text-muted-foreground"
          />
          <h2 className="text-2xl font-semibold">{roomId} not found</h2>
          <p className="text-muted-foreground">
            {`The room you're looking for doesn't exist or you don't have access to it.`}
          </p>
          <Button onClick={handleBackToRooms}>
            <Icon solid name="px-arrow-up" className="size-5 mr-2 -rotate-90" />
            Back to Rooms
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="w-full mx-auto">
        {/* Header */}
        <RoomHeader
          handleBackToRooms={handleBackToRooms}
          activeRoomData={activeRoomData}
          logoutFn={onLogout}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-4 right-4 p-4 bg-destructive text-destructive-foreground rounded-lg shadow-lg"
          >
            Error: {error.message}
          </motion.div>
        )}

        {/* Permissions Modal */}
        {showPermissionsModal && selectedUser && (
          <PermissionsModal selectedUser={selectedUser} />
        )}
      </div>
    </div>
  );
};

interface MesssageWindowProps {
  sidebarProps: IOriginalSidebar;
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
  userId: string;
  decryptMessage: (message: Message | Ver) => Promise<string>;
}
export const OriginalMessageWindow = ({
  sidebarProps,
  messages,
  messagesEndRef,
  decryptMessage,
  userId,
}: MesssageWindowProps) => (
  <MessageWindow sidebarProps={sidebarProps}>
    <Messages
      messages={messages}
      messagesEndRef={messagesEndRef}
      userId={userId}
      decryptMessage={decryptMessage}
    />
    <MessageCtrl />
  </MessageWindow>
);
