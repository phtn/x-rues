"use client";

import { User } from "@/components/chat/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatCtx } from "@/ctx/chat-ctx";
import { useChatRoom } from "@/hooks/use-chatroom";
import { Icon } from "@/lib/icons";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useCallback, useEffect } from "react";

interface RoomsListProps {
  userId: string;
}

export default function RoomsList({ userId }: RoomsListProps) {
  const router = useRouter();
  const {
    currentUser,
    isLoading,
    error,
    deleteRoom,
    newRoomName,
    setNewRoomName,
    createRoom,
    onLogout,
    chatRooms,
    loadRoomsAndMessages,
  } = useChatCtx();

  const {} = useChatRoom();

  // Load rooms when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadRoomsAndMessages(userId);
      // Poll for updates every 3 seconds
      const interval = setInterval(loadRoomsAndMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [currentUser, loadRoomsAndMessages, userId]);

  // Redirect to lobby if not authenticated
  useEffect(() => {
    if (!currentUser && !isLoading) {
      router.push("/lobby");
    }
  }, [currentUser, isLoading, router]);

  const handleRoomNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewRoomName(e.target.value);
    },
    [setNewRoomName],
  );

  const handleCreateRoom = useCallback(async () => {
    const roomId = await createRoom();
    if (roomId) {
      // Navigate directly to the user-specific room page
      router.push(`/lobby/${userId}/rooms/${roomId}`);
    }
  }, [createRoom, router, userId]);

  const handleJoinRoom = useCallback(
    (roomId: string) => () => {
      // Navigate directly to the user-specific room page
      router.push(`/lobby/${userId}/rooms/${roomId}`);
    },
    [router, userId],
  );

  const notSelf = useCallback(
    (user: User) => currentUser && user.id !== currentUser.id,
    [currentUser],
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-start justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="px-4 py-8 border-2 dark:border-accent rounded-[2.5rem] w-5xl mt-28">
        <div className="mx-auto p-6 space-y-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-12 pt-8 pb-3 border-b-2 border-border"
          >
            <div>
              <h1 className="text-2xl font-medium tracking-tight font-ox">
                {currentUser.name}
              </h1>
              <p className="font-mono text-muted-foreground mt-1">
                sha-512 ready
              </p>
            </div>
            <Button
              onClick={onLogout}
              variant="secondary"
              className="shadow-none"
            >
              <Icon
                solid
                name="px-chevrons-vertical"
                className="size-5 mr-1 rotate-90"
              />
              Logout
            </Button>
          </motion.div>

          {/* Rooms List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 tracking-tight">
              Chat Rooms
            </h2>

            {chatRooms.length === 0 ? (
              <div className="text-center py-16 bg-accent rounded-lg border">
                <Icon
                  solid
                  name="spinners-ring"
                  className="size-6 mx-auto text-muted-foreground mb-4"
                />
                <p className="text-muted-foreground">
                  Secure linking in progress...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {chatRooms.map((room, index) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.2 }}
                      transition={{
                        type: "spring",
                        visualDuration: 0.45,
                        bounce: 0.5,
                        delay: index * 0.15,
                      }}
                      className="p-6 md:p-3 md:pb-1 bg-card rounded-lg border hover:shadow-md cursor-pointer group"
                      onClick={handleJoinRoom(room.id)}
                    >
                      <div className="flex justify-between items-start relative">
                        <div className="p-2 flex-1 space-y-6">
                          <h3 className="text-lg font-se font-semibold text-neutral-200">
                            {room.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 font-semibold font-space text-sm">
                            <div className="flex items-center gap-1 text-cyan-200">
                              <Icon solid name="px-user" className="size-4" />
                              <span>{room.members.length}</span>
                            </div>
                            <div className="flex items-center gap-1 text-orange-200">
                              <Icon solid name="px-chat" className="size-4" />
                              <span>{room.messages.length}</span>
                            </div>
                          </div>

                          {/* Members preview */}
                          <div className="mt-6 w-full">
                            <div className="flex flex-wrap gap-1">
                              {room.members.filter(notSelf).map((member) => (
                                <span
                                  key={member.id}
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    member.id === currentUser.id
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {member.name.substring(0, 1)}
                                  {member.id !== currentUser.id}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-end mt-4 text-[9px] w-full text-neutral-400 font-mono">
                              <span>{format(room.createdAt, "PP")}</span>
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-0 right-0 flex flex-col items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRoom(room.id);
                            }}
                            className="bg-neutral-900 rounded-full text-lime-200 hover:bg-lime-200 cursor-pointer"
                          >
                            <Icon
                              solid
                              name="px-arrow-up"
                              className="size-6 rotate-45"
                            />
                          </Button>
                          {room.creatorId === currentUser.id && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRoom(room.id);
                              }}
                              className="bg-neutral-900 text-red-300 hover:bg-red-200 rounded-full cursor-pointer"
                            >
                              <Icon
                                solid
                                name="px-close"
                                className="size-6 rotate-90"
                              />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Create Room Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-accent rounded-lg border"
          >
            <h2 className="text-xl font-semibold mb-4">Create New Room</h2>
            <div className="flex gap-4">
              <Input
                type="text"
                value={newRoomName}
                onChange={handleRoomNameChange}
                placeholder="Enter room name"
                onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
                className="flex-1 shadow-none"
              />
              <Button
                onClick={handleCreateRoom}
                disabled={!newRoomName.trim() || isLoading}
                className="px-6 rounded-sm"
              >
                <Icon name="px-plus" className="size-3.5 mr-1" />
                Create
              </Button>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
            >
              <p className="text-destructive font-medium">
                Error: {error.message}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
