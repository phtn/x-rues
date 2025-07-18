export type MessageType = "text" | "image" | "audio";
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: MessageType;
}
