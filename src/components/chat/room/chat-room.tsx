"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatCtx } from "@/ctx/chat-ctx";
import { usePermissionsCtx } from "@/ctx/permissions-ctx";
import { useChatRoom } from "@/hooks/use-chatroom";
import { Icon } from "@/lib/icons";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useCallback, useEffect, useRef } from "react";
import { ImageUpload } from "../image-upload";
import { MessageBubble } from "../message-bubble";
import { PermissionsModal } from "../permissions";

interface ChatRoomProps {
  roomId: string;
  userId: string;
}

export const ChatRoom = ({ roomId, userId }: ChatRoomProps) => {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentUser,
    joinRoom,
    isLoading,
    error,
    handleImageSelect,
    newMessage,
    setNewMessage,
    sendMessage,
    onLogout,
    decryptMessage,
    setActiveRoom,
  } = useChatCtx();

  const { chatRooms, loadRoomsAndMessages } = useChatRoom();

  const { withPermission, selectedUser, onUserSelect, showPermissionsModal } =
    usePermissionsCtx();

  // Set active room and join it
  useEffect(() => {
    if (currentUser && roomId) {
      setActiveRoom(roomId);
      joinRoom(roomId);
    }
  }, [currentUser, roomId, setActiveRoom, joinRoom]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatRooms]);

  // Load rooms and messages when user logs in
  useEffect(() => {
    if (currentUser) {
      loadRoomsAndMessages();
      // Poll for updates every 2 seconds
      const interval = setInterval(loadRoomsAndMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [currentUser, loadRoomsAndMessages]);

  // Redirect to lobby if not authenticated
  useEffect(() => {
    if (!userId && !isLoading) {
      router.push("/lobby");
    }
  }, [userId, isLoading, router]);

  const activeRoomData = chatRooms.find((r) => r.id === roomId);

  const handleMessageInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewMessage(e.target.value);
    },
    [setNewMessage],
  );

  const handleBackToRooms = useCallback(() => {
    router.push(`/lobby/${userId}/rooms`);
  }, [router, userId]);

  if (!roomId && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!activeRoomData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon
            name="px-chat"
            className="size-16 mx-auto text-muted-foreground"
          />
          <h2 className="text-2xl font-semibold">{roomId} not found</h2>
          <p className="text-muted-foreground">
            {`The room you're looking for doesn't exist or you don't have access to it.`}
          </p>
          <Button onClick={handleBackToRooms}>
            <Icon name="px-arrow-left" className="size-4 mr-2" />
            Back to Rooms
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border-b p-4 flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToRooms}
              className="flex items-center gap-2"
            >
              <Icon name="px-arrow-left" className="size-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">{activeRoomData.name}</h1>
              <p className="text-sm text-muted-foreground">
                {activeRoomData.members.length} members •{" "}
                {activeRoomData.messages.length} messages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Hi, {currentUser?.name}!
            </span>
            <Button onClick={onLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="flex h-[calc(100vh-8rem)]">
          {/* Sidebar - Members */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-80 border-r bg-card/50 p-4 overflow-y-auto"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Icon name="px-user" className="size-4" />
              Room Members
            </h3>
            <div className="space-y-2">
              {activeRoomData.members.map((member) => (
                <div
                  key={member.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                    member.id === currentUser?.id
                      ? "bg-primary/10 border-primary/20"
                      : ""
                  }`}
                  onClick={() =>
                    member.id !== currentUser?.id && onUserSelect(member)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {member.name}
                        {member.id === currentUser?.id && (
                          <span className="text-xs text-primary ml-2">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.id === activeRoomData.creatorId &&
                          "Room Creator"}
                      </p>
                    </div>
                    {member.id !== currentUser?.id && (
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            withPermission(member.id)
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          title={`${withPermission(member.id) ? "Can" : "Cannot"} decrypt your messages`}
                        />
                        <span className="text-xs">
                          {withPermission(member.id) ? "✅" : "🚫"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Chat Area */}
          <div className="flex flex-col flex-1">
            {/* Messages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 p-4 overflow-y-auto space-y-4"
            >
              <AnimatePresence>
                {activeRoomData.messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <MessageBubble
                      message={message}
                      currentUserId={currentUser?.id ?? ""}
                      decryptMessage={decryptMessage}
                      isOwn={message.senderId === currentUser?.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </motion.div>

            {/* Message Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-card border-t"
            >
              <div className="flex items-end gap-3">
                <ImageUpload
                  disabled={isLoading}
                  onImageSelect={handleImageSelect}
                />
                <div className="flex-1">
                  <Input
                    type="text"
                    value={newMessage}
                    placeholder="Type your message..."
                    onChange={handleMessageInputChange}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={isLoading}
                    className="resize-none"
                  />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !newMessage.trim()}
                  size="sm"
                  className="px-6"
                >
                  <Icon name="px-paper-airplane" className="size-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

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
