// Types for the chat application

export interface User {
  id: string;
  name: string;
  public_key: string;
  private_key: string;
}

export interface DecryptionPermission {
  fromUserId: string;
  toUserId: string;
  allowed: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  encryptedVersions: { [recipientId: string]: string };
  timestamp: Date;
  roomId: string;
  messageType: "text" | "image";
  fileName?: string;
}

export interface IChatRoom {
  id: string;
  name: string;
  members: User[];
  messages: Message[];
  permissions: DecryptionPermission[];
  creatorId: string;
  createdAt: Date;
}

// API Types
export interface CryptoApiRequest {
  publicKey?: string;
  privateKey?: string;
  data?: string;
  encryptedData?: string;
}

export interface ApiRoom {
  id: string;
  name: string;
  members: User[];
  createdAt: string;
  creatorId: string;
}

export interface ApiMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  encryptedVersions: { [recipientId: string]: string };
  timestamp: string;
  roomId: string;
  messageType: "text" | "image";
  fileName?: string;
}

export interface ApiPermission {
  fromUserId: string;
  toUserId: string;
  roomId: string;
  allowed: boolean;
  timestamp: string;
}

export interface RoomApiData {
  name?: string;
  creator?: User;
  roomId?: string;
  user?: User;
  userId?: string;
  senderId?: string;
  senderName?: string;
  content?: string;
  encryptedVersions?: { [recipientId: string]: string };
  fromUserId?: string;
  toUserId?: string;
  allowed?: boolean;
  messageType?: "text" | "image";
  fileName?: string;
}
