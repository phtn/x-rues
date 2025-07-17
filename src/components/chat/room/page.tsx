import { Content } from "./content";

interface ChatRoomPageProps {
  params: Promise<{ roomId: string; userId: string }>;
}

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { roomId, userId } = await params;

  return (
    <div className="mt-16">
      <Content roomId={roomId} userId={userId} />
    </div>
  );
}
