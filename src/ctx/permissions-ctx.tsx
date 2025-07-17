"use client";

import { User } from "@/components/chat/types";
import { useChatRoom } from "@/hooks/use-chatroom";
import {
  createContext,
  useMemo,
  useContext,
  type ReactNode,
  useCallback,
  useState,
} from "react";
import { useChatCtx } from "./chat-ctx";

interface PermissionsProviderProps {
  children: ReactNode;
}

interface PermissionsCtxValues {
  selectedUser: User | null;
  setPermission: (target: string, allowed: boolean) => () => Promise<void>;
  onUserSelect: (user: User) => void;
  withPermission: (id: string) => boolean;
  showPermissionsModal: boolean;
  handleCloseModal: VoidFunction;
}

const PermissionsCtx = createContext<PermissionsCtxValues | null>(null);

const PermissionsCtxProvider = ({ children }: PermissionsProviderProps) => {
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { currentUser, activeRoom } = useChatCtx();

  const handleCloseModal = useCallback(
    () => setShowPermissionsModal(false),
    [],
  );

  const { roomsApiCall, chatRooms } = useChatRoom();

  const setPermission = useCallback(
    (toUserId: string, allowed: boolean) => async () => {
      if (!currentUser || !activeRoom) return;

      try {
        await roomsApiCall("SET_PERMISSION", {
          fromUserId: currentUser.id,
          toUserId,
          roomId: activeRoom,
          allowed,
        });

        // loadRoomsAndMessages(); // Refresh to get updated permissions
        setShowPermissionsModal(false);
        setSelectedUser(null);
      } catch (e) {
        console.error(
          e instanceof Error ? e.message : "Failed to set permission",
        );
      }
    },
    [activeRoom, currentUser, roomsApiCall],
  );

  const activeRoomData = chatRooms.find((r) => r.id === activeRoom);
  // Get current permission for a user
  const withPermission = useCallback(
    (toUserId: string): boolean => {
      if (!activeRoom || !currentUser) return true;

      const permission = activeRoomData?.permissions?.find(
        (p) => p.fromUserId === currentUser.id && p.toUserId === toUserId,
      );

      return permission ? permission.allowed : true; // Default to allowed
    },
    [activeRoom, currentUser, activeRoomData],
  );

  // Handle member click to show permissions modal
  const onUserSelect = useCallback(
    (user: User) => {
      if (user.id === currentUser?.id) return; // Can't set permissions for self
      setSelectedUser(user);
      setShowPermissionsModal(true);
    },
    [currentUser?.id],
  );

  const value = useMemo(
    () => ({
      showPermissionsModal,
      handleCloseModal,
      withPermission,

      setPermission,
      onUserSelect,
      selectedUser,
    }),
    [
      showPermissionsModal,
      handleCloseModal,
      withPermission,
      setPermission,
      onUserSelect,
      selectedUser,
    ],
  );
  return <PermissionsCtx value={value}>{children}</PermissionsCtx>;
};

const usePermissionsCtx = () => {
  const ctx = useContext(PermissionsCtx);
  if (!ctx) throw new Error("PermissionsCtxProvider is missing");
  return ctx;
};

export { PermissionsCtx, PermissionsCtxProvider, usePermissionsCtx };
