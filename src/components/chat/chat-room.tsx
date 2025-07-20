"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatCtx } from "@/ctx/chat-ctx";
import { usePermissionsCtx } from "@/ctx/permissions-ctx";
import { Icon } from "@/lib/icons";
import { type ChangeEvent, useCallback, useEffect, useRef } from "react";
import { ImageUpload } from "./image-upload";
import { ChatBubble } from "./message-bubble";
import { PermissionsModal } from "./permissions";

export const ChatRoom = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentUser,
    joinRoom,
    isLoading,
    error,
    handleImageSelect,
    deleteRoom,
    newMessage,
    setNewMessage,
    sendMessage,
    createRoom,
    newRoomName,
    setNewRoomName,
    onLogout,
    decryptMessage,
    activeRoom,
    chatRooms,
    loadRoomsAndMessages,
  } = useChatCtx();

  const { withPermission, selectedUser, onUserSelect, showPermissionsModal } =
    usePermissionsCtx();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatRooms]);

  // Load rooms and messages when user logs in
  useEffect(() => {
    let interval = 0;
    if (currentUser) {
      loadRoomsAndMessages(currentUser.id);
      // Poll for updates every 2 seconds
      interval = setInterval(loadRoomsAndMessages, 2000);
    }
    return () => clearInterval(interval);
  }, [currentUser, loadRoomsAndMessages]);

  // Initialize user with keypair

  // Find active room data with null check
  const activeRoomData = activeRoom
    ? chatRooms.find((r) => r.id === activeRoom)
    : undefined;

  const handleJoinRoom = useCallback(
    (id: string) => () => joinRoom(id),
    [joinRoom],
  );

  const handleMessageInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewMessage(e.target.value);
    },
    [setNewMessage],
  );

  const handleRoomNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewRoomName(e.target.value);
    },
    [setNewRoomName],
  );

  return (
    <div className="max-w-7xl mx-auto rounded-sm bg-slate-300/20 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-300/10 p-3 flex justify-between items-center">
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>
            Hi, {currentUser?.name}!
          </h2>
          {/* <p
            style={{ fontSize: "0.875rem", opacity: 0.75, margin: "4px 0 0 0" }}
          >
            Public Key: {currentUser.public_key.substring(0, 20)}...
          </p> */}
        </div>
        <Button onClick={onLogout} variant="secondary">
          Logout
        </Button>
      </div>

      <div className="flex h-[60lvh]">
        {/* Sidebar - Rooms */}
        <div className="w-1/3 border-r bg-slate-200/20 p-4">
          <div>
            <h3 className="h-8">Create Room</h3>
            <div className="flex gap-4 space-y-4">
              <Input
                type="text"
                value={newRoomName}
                onChange={handleRoomNameChange}
                placeholder="Room name"
                onKeyDown={(e) => e.key === "Enter" && createRoom()}
                className="my-2 bg-input py-2 rounded-lg px-3"
              />
              <Button
                size={"icon"}
                onClick={createRoom}
                className="hover:bg-[#059669] bg-[#10b981] grow-0"
              >
                <Icon name="px-check" solid className="size-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3>Chat Rooms</h3>
            <div className="flex flex-col gap-4">
              {chatRooms.map((room) => (
                <div key={room.id} className="">
                  <div
                    onClick={handleJoinRoom(room.id)}
                    className="hover:bg-slate-300/20 rounded p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">{room.name}</div>
                      {room.creatorId === currentUser?.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRoom(room.id);
                          }}
                          className="hover:bg-[#b91c1c]"
                          title="Delete room (creator only)"
                        >
                          -
                        </button>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center">
                      <Icon name="px-user" className="size-4" solid />
                      <span className="text-sm ml-1.5">
                        {room.members.length}
                      </span>
                      <div className="w-6 h-px" />
                      <Icon name="px-chat" className="size-4" solid />
                      <span className="text-sm ml-1.5">
                        {room.messages.length}
                      </span>
                      <span>
                        {room.creatorId === currentUser?.id && (
                          <span style={{ marginLeft: "8px", color: "#fbbf24" }}>
                            &middot;
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col w-full relative z-40">
          {activeRoomData ? (
            <>
              {/* Room Header */}
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #475569",
                }}
              >
                <h3 style={{ fontWeight: "bold", margin: 0, color: "#f1f5f9" }}>
                  {activeRoomData.name}
                </h3>
                <div className="border bg-orange-300">
                  Members:
                  {activeRoomData.members.map((member, index) => (
                    <span key={member.id}>
                      {member.id === currentUser?.id ? (
                        <span
                          className="bg-pink-400"
                          style={{ color: "#60a5fa" }}
                        >
                          {member.name} (you)
                        </span>
                      ) : (
                        <span
                          onClick={() => onUserSelect}
                          style={{
                            color: withPermission(member.id)
                              ? "#10b981"
                              : "#ef4444",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          title={`Click to ${withPermission(member.id) ? "block" : "allow"} ${member.name} from reading your messages`}
                        >
                          {member.name}{" "}
                          {withPermission(member.id) ? "✅" : "🚫"}
                        </span>
                      )}
                      {index < activeRoomData.members.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>

              {/* Messages */}

              <div className="flex flex-col h-full p-4 overflow-y-auto gap-3">
                {activeRoomData.messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    currentUserId={currentUser?.id as string}
                    decryptMessage={decryptMessage}
                    isOwn={message.senderId === currentUser?.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div
                className=""
                style={{
                  padding: "16px",
                  backgroundColor: "#334155",
                  borderTop: "1px solid #475569",
                }}
              >
                <div
                  style={{
                    gap: "8px",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <ImageUpload
                    disabled={isLoading}
                    onImageSelect={handleImageSelect}
                  />
                  <input
                    type="text"
                    value={newMessage}
                    placeholder="Type your message..."
                    onChange={handleMessageInputChange}
                    style={{
                      flex: 1,
                      color: "#f1f5f9",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !newMessage.trim()}
                    style={{
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "4px",
                      padding: "8px 24px",
                      backgroundColor: "#3b82f6",
                      opacity: isLoading || !newMessage.trim() ? 0.5 : 1,
                    }}
                    className="hover:bg-[#2563eb] bg-[#3b82f6]"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-24 flex justify-center items-center">
              Select a room to start chatting
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-orange-200 p-4 font-mono border-t">
          Error: {error.message}
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <PermissionsModal selectedUser={selectedUser} />
      )}
    </div>
  );
};
