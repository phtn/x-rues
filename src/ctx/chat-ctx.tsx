"use client";

import { Ver } from "@/components/chat/image-message";
import { ApiRoom, Message, User } from "@/components/chat/types";
import { useChatRoom } from "@/hooks/use-chatroom";
import { handleAsync } from "@/utils/async-handler";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface ChatProviderProps {
  children: ReactNode;
}

interface ChatCtxValues {
  currentUser: User | null;
  activeRoom: string | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  setActiveRoom: Dispatch<SetStateAction<string | null>>;
  isLoading: boolean;
  error: Error | null;
  loginUser: (userId: string) => Promise<void>;
  createRoom: () => Promise<string | null>;
  joinRoom: (roomId: string) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
  decryptMessage: (message: Message | Ver) => Promise<string>;
  sendMessage: () => Promise<void>;
  handleImageSelect: (imageData: string, fileName: string) => Promise<void>;
  newMessage: string;
  setNewMessage: Dispatch<SetStateAction<string>>;
  setNewRoomName: Dispatch<SetStateAction<string>>;
  newRoomName: string;
  onLogout: VoidFunction;
}

const ChatCtx = createContext<ChatCtxValues | null>(null);

const ChatCtxProvider = ({ children }: ChatProviderProps) => {
  const pathname = usePathname();
  const {
    chatRooms,
    ruesApiCall,
    roomsApiCall,
    loadRoomsAndMessages,
    MOCK_USERS,
  } = useChatRoom();
  const userId = pathname.split("/")[1];
  const currentUsr = MOCK_USERS.find((e) => e.id === userId) ?? null;
  const [currentUser, setCurrentUser] = useState<User | null>(currentUsr);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState("");
  const [newRoomName, setNewRoomName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loginUser = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const mockUser = MOCK_USERS.find((u) => u.id === userId);
        if (!mockUser) throw new Error("User not found");

        // Generate keypair for user
        const { keypair } = await ruesApiCall<{
          keypair: { private_key: string; public_key: string };
        }>("/genkeyp");

        const user: User = {
          ...mockUser,
          ...keypair,
        };

        setCurrentUser(user);
      } catch (e) {
        setError(e instanceof Error ? e : null);
      } finally {
        setIsLoading(false);
      }
    },
    [MOCK_USERS, ruesApiCall, setCurrentUser],
  );

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !currentUser || !activeRoom) return;

    setIsLoading(true);
    setError(null);

    try {
      const room = chatRooms.find((r) => r.id === activeRoom);
      if (!room) throw new Error("Room not found");

      // Get other members (excluding sender)
      const otherMembers = room.members.filter((m) => m.id !== currentUser.id);

      // Create encrypted versions for each member based on permissions
      const encryptedVersions: { [recipientId: string]: string } = {};

      for (const member of otherMembers) {
        // Check if current user allows this member to decrypt their messages
        const permission = room.permissions?.find(
          (p) => p.fromUserId === currentUser.id && p.toUserId === member.id,
        );

        // Default to allowed if no explicit permission set
        const isAllowed = permission ? permission.allowed : true;

        if (isAllowed) {
          const { encryptedData } = (
            await handleAsync(ruesApiCall)("/encrypt", "POST", {
              publicKey: member.public_key,
              data: newMessage,
            })
          ).data as { encryptedData: string };

          if (encryptedData) {
            encryptedVersions[member.id] = encryptedData;
          } else {
            console.error(`Failed to encrypt for ${member.name}`);
          }
        }
        // If not allowed, don't create an encrypted version for this user
      }

      // Send message to shared API
      await roomsApiCall("SEND_MESSAGE", {
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: newMessage,
        encryptedVersions,
        roomId: activeRoom,
      });

      setNewMessage("");
      loadRoomsAndMessages(); // Refresh to get the new message
    } catch (e) {
      setError(e instanceof Error ? e : null);
    } finally {
      setIsLoading(false);
    }
  }, [
    activeRoom,
    chatRooms,
    currentUser,
    loadRoomsAndMessages,
    newMessage,
    roomsApiCall,
    ruesApiCall,
  ]);

  // Decrypt message for current user - memoized to prevent infinite re-renders
  const decryptMessage = useCallback(
    async (message: Message | Ver): Promise<string> => {
      if (!currentUser) {
        return "";
      }

      // Show plaintext for own messages (only applies to Message type)
      if ("senderId" in message && message.senderId === currentUser.id) {
        return message.content;
      }

      // Check if there's an encrypted version for current user
      const encryptedForMe = message.encryptedVersions?.[currentUser.id];

      if (!encryptedForMe) {
        // No encrypted version means sender didn't allow this user to decrypt
        return ""; // Return empty string to hide the message completely
      }

      try {
        const { decryptedData } = await ruesApiCall<{ decryptedData: string }>(
          "/decrypt",
          "POST",
          {
            privateKey: currentUser.public_key,
            encryptedData: encryptedForMe,
          },
        );
        return decryptedData;
      } catch (error) {
        console.error("Decryption failed:", error);
        return ""; // Return empty string if decryption fails
      }
    },
    [currentUser, ruesApiCall], // Use specific properties to make it more stable
  );

  // Create new chat room
  const createRoom = useCallback(async (): Promise<string | null> => {
    if (!newRoomName.trim() || !currentUser) return null;

    setIsLoading(true);
    setError(null);

    try {
      const { room } = (
        await handleAsync(roomsApiCall)("CREATE_ROOM", {
          name: newRoomName,
          creator: currentUser,
        })
      ).data as { room: ApiRoom };

      if (room) {
        setNewRoomName("");
        setActiveRoom(room.id);
        loadRoomsAndMessages();
        return room.id;
      } else {
        setError(new Error("Failed to create room"));
        return null;
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to create room"));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [
    currentUser,
    loadRoomsAndMessages,
    newRoomName,
    roomsApiCall,
    setActiveRoom,
  ]);

  // Join existing room
  const joinRoom = useCallback(
    async (roomId: string) => {
      if (!currentUser) return;

      const { data, error } = await handleAsync(roomsApiCall)("JOIN_ROOM", {
        roomId,
        user: currentUser,
      });

      if (data) {
        setActiveRoom(roomId);
        loadRoomsAndMessages(); // Refresh to get updated member list
      }
      if (error) {
        console.error("Failed to join room:", error);
        setActiveRoom(roomId); // Still allow viewing the room
      }
    },
    [currentUser, loadRoomsAndMessages, roomsApiCall, setActiveRoom],
  );

  // Delete room (only for creators)
  const deleteRoom = useCallback(
    async (roomId: string) => {
      if (!currentUser) return;

      const room = chatRooms.find((r) => r.id === roomId);
      if (!room) return;

      // Confirm deletion
      if (
        !confirm(
          `Are you sure you want to delete "${room.name}"? This will permanently delete all messages and cannot be undone.`,
        )
      ) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await roomsApiCall("DELETE_ROOM", {
          roomId,
          userId: currentUser.id,
        });

        // If the deleted room was active, clear the active room
        if (activeRoom === roomId) {
          setActiveRoom(null);
        }

        loadRoomsAndMessages(); // Refresh the rooms list
      } catch (e) {
        setError(e instanceof Error ? e : null);
      } finally {
        setIsLoading(false);
      }
    },
    [
      activeRoom,
      chatRooms,
      currentUser,
      loadRoomsAndMessages,
      roomsApiCall,
      setActiveRoom,
    ],
  );

  // Handle image selection and send as encrypted message
  const handleImageSelect = useCallback(
    async (imageData: string, fileName: string) => {
      if (!currentUser || !activeRoom) return;

      setIsLoading(true);
      setError(null);

      try {
        const room = chatRooms.find((r) => r.id === activeRoom);
        if (!room) throw new Error("Room not found");

        // Get other members (excluding sender)
        const otherMembers = room.members.filter(
          (m) => m.id !== currentUser.id,
        );

        // Create encrypted versions for each member based on permissions
        const encryptedVersions: { [recipientId: string]: string } = {};

        for (const member of otherMembers) {
          // Check if current user allows this member to decrypt their messages
          const permission = room.permissions?.find(
            (p) => p.fromUserId === currentUser.id && p.toUserId === member.id,
          );

          // Default to allowed if no explicit permission set
          const isAllowed = permission ? permission.allowed : true;

          if (isAllowed) {
            try {
              const { encryptedData } = await ruesApiCall<{
                encryptedData: string;
              }>("/encrypt", "POST", {
                publicKey: member.public_key,
                data: imageData, // Encrypt the base64 image data
              });
              encryptedVersions[member.id] = encryptedData;
            } catch (e) {
              console.error(`Failed to encrypt image for ${member.name}:`, e);
            }
          }
        }

        // Send image message to shared API
        await roomsApiCall("SEND_MESSAGE", {
          senderId: currentUser.id,
          senderName: currentUser.name,
          content: imageData, // Store original image data for sender
          encryptedVersions,
          roomId: activeRoom,
          messageType: "image",
          fileName,
        });

        loadRoomsAndMessages(); // Refresh to get the new message
      } catch (e) {
        setError(e instanceof Error ? e : null);
      } finally {
        setIsLoading(false);
      }
    },
    [
      activeRoom,
      chatRooms,
      currentUser,
      loadRoomsAndMessages,
      roomsApiCall,
      ruesApiCall,
    ],
  );

  const onLogout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      activeRoom,
      setCurrentUser,
      setActiveRoom,
      isLoading,
      error,
      createRoom,
      joinRoom,
      deleteRoom,
      decryptMessage,
      sendMessage,
      loginUser,
      handleImageSelect,
      newMessage,
      setNewMessage,
      setNewRoomName,
      newRoomName,
      onLogout,
    }),
    [
      currentUser,
      activeRoom,
      setCurrentUser,
      setActiveRoom,
      isLoading,
      error,
      createRoom,
      joinRoom,
      deleteRoom,
      decryptMessage,
      sendMessage,
      loginUser,
      handleImageSelect,
      newMessage,
      setNewMessage,
      setNewRoomName,
      newRoomName,
      onLogout,
    ],
  );
  return <ChatCtx value={value}>{children}</ChatCtx>;
};

const useChatCtx = () => {
  const ctx = useContext(ChatCtx);
  if (!ctx) throw new Error("ChatCtxProvider is missing");
  return ctx;
};

export { ChatCtx, ChatCtxProvider, useChatCtx };
