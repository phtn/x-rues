import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Types for API data structures
interface ApiRoom {
  id: string;
  name: string;
  members: ApiUser[];
  createdAt: string;
  creatorId: string;
}

interface ApiUser {
  id: string;
  name: string;
  publicKey: string;
  privateKey: string;
}

interface ApiMessage {
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

interface ApiPermission {
  fromUserId: string;
  toUserId: string;
  roomId: string;
  allowed: boolean;
  timestamp: string;
}

interface StorageData {
  rooms: ApiRoom[];
  messages: ApiMessage[];
  permissions: ApiPermission[];
}

// File-based persistence
const DATA_FILE = path.join(process.cwd(), "data", "chat-data.json");

// Initialize storage
let rooms: ApiRoom[] = [];
let messages: ApiMessage[] = [];
let permissions: ApiPermission[] = [];

// Load data from file
async function loadData(): Promise<void> {
  try {
    // Ensure data directory exists
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });

    const data = await fs.readFile(DATA_FILE, "utf-8");
    const parsed: StorageData = JSON.parse(data);
    rooms = parsed.rooms || [];
    messages = parsed.messages || [];
    permissions = parsed.permissions || [];
  } catch (e) {
    // File doesn't exist or is invalid, start with empty data
    console.log("No existing data file found, starting fresh", e);
  }
}

// Save data to file
async function saveData(): Promise<void> {
  try {
    const data: StorageData = { rooms, messages, permissions };
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to save data:", error);
  }
}

// Initialize data on module load
loadData();

export async function GET() {
  return NextResponse.json({ rooms, messages, permissions });
}

export async function POST(request: Request) {
  const { action, data } = await request.json();

  switch (action) {
    case "CREATE_ROOM":
      const newRoom = {
        id: `room-${Date.now()}`,
        name: data.name,
        members: [data.creator],
        createdAt: new Date().toISOString(),
        creatorId: data.creator.id,
      };
      rooms.push(newRoom);
      await saveData();
      return NextResponse.json({ room: newRoom });

    case "JOIN_ROOM":
      const roomIndex = rooms.findIndex((r) => r.id === data.roomId);
      if (roomIndex !== -1) {
        const existingMember = rooms[roomIndex].members.find(
          (m) => m.id === data.user.id,
        );
        if (!existingMember) {
          rooms[roomIndex].members.push(data.user);
          await saveData();
        }
        return NextResponse.json({ room: rooms[roomIndex] });
      }
      return NextResponse.json({ error: "Room not found" }, { status: 404 });

    case "DELETE_ROOM":
      const roomToDeleteIndex = rooms.findIndex((r) => r.id === data.roomId);
      if (roomToDeleteIndex === -1) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }

      const roomToDelete = rooms[roomToDeleteIndex];
      // Check if the user is the creator
      if (roomToDelete.creatorId !== data.userId) {
        return NextResponse.json(
          { error: "Only the room creator can delete this room" },
          { status: 403 },
        );
      }

      // Remove the room
      rooms.splice(roomToDeleteIndex, 1);

      // Remove all messages from this room
      const messagesToRemove = messages.filter((m) => m.roomId === data.roomId);
      messages = messages.filter((m) => m.roomId !== data.roomId);

      // Remove all permissions for this room
      permissions = permissions.filter((p) => p.roomId !== data.roomId);

      await saveData();
      return NextResponse.json({
        success: true,
        deletedRoom: roomToDelete,
        deletedMessages: messagesToRemove.length,
        deletedPermissions: permissions.length,
      });

    case "SEND_MESSAGE":
      const message: ApiMessage = {
        id: `msg-${Date.now()}`,
        senderId: data.senderId,
        senderName: data.senderName,
        content: data.content,
        encryptedVersions: data.encryptedVersions || {}, // Multiple encrypted versions
        timestamp: new Date().toISOString(),
        roomId: data.roomId,
        messageType: data.messageType || "text",
        fileName: data.fileName,
      };
      messages.push(message);
      await saveData();
      return NextResponse.json({ message });

    case "SET_PERMISSION":
      // Remove existing permission if it exists
      const existingPermissionIndex = permissions.findIndex(
        (p) =>
          p.fromUserId === data.fromUserId &&
          p.toUserId === data.toUserId &&
          p.roomId === data.roomId,
      );
      if (existingPermissionIndex !== -1) {
        permissions.splice(existingPermissionIndex, 1);
      }

      // Add new permission
      const permission: ApiPermission = {
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        roomId: data.roomId,
        allowed: data.allowed,
        timestamp: new Date().toISOString(),
      };
      permissions.push(permission);
      await saveData();
      return NextResponse.json({ permission });

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
