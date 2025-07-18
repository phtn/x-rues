import type {
  ApiMessage,
  ApiPermission,
  ApiRoom,
  CryptoApiRequest,
  RoomApiData,
  User,
} from "@/components/chat/types";
import { useCallback } from "react";

export const useChatRoom = () => {
  // Mock users for demo
  //
  const MOCK_USERS = [
    {
      id: "alice",
      name: "Alice",
      public_key: "RXZRKn5qj0klMpr6HXAw2G1obH2NWxN+vIGYhDDTW0U=",
      private_key: "QtNxTCjn9d/m+zHAOS+0khVxf7tyUCVFpvdGsIg7JNY=",
    },
    {
      id: "bob",
      name: "Bob",
      public_key: "VDxY6AmpB1kWVhVLbcbz6umfIFZHcuYA4u5dfzZ8WxU=",
      private_key: "o0UjKydZLiniAaiWYg5e2wudFm80SGWWp/6fBEYIkM4=",
    },
    {
      id: "charlie",
      name: "Charlie",
      public_key: "VDxY6AmpB1kWVhVLbcbz6umfIFZHcuYA4u5dfzZ8WxU=",
      private_key: "o0UjKydZLiniAaiWYg5e2wudFm80SGWWp/6fBEYIkM4=",
    },
  ] as User[];

  // Get all rooms and messages
  const getRoomsAndMessages = useCallback(async (): Promise<{
    rooms: ApiRoom[];
    messages: ApiMessage[];
    permissions: ApiPermission[];
  }> => {
    const response = await fetch("/api/chat");
    if (!response.ok) {
      throw new Error(`Failed to fetch rooms: ${response.status}`);
    }
    return response.json();
  }, []);

  // API helpers
  const ruesApiCall = useCallback(
    async <T>(
      endpoint: string,
      method = "GET",
      body?: CryptoApiRequest,
    ): Promise<T> => {
      const response = await fetch(`/api/rues${endpoint}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : {},
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      return response.json();
    },
    [],
  );

  // Rooms API helper
  const roomsApiCall = useCallback(
    async <T>(action: string, data?: RoomApiData): Promise<T> => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data }),
      });

      if (!response.ok) {
        throw new Error(`Rooms API call failed: ${response.status}`);
      }

      return response.json();
    },
    [],
  );

  return {
    ruesApiCall,
    roomsApiCall,
    getRoomsAndMessages,
    MOCK_USERS,
  };
};
