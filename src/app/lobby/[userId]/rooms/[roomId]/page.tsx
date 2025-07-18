import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Content } from "./content";

interface RoomPageProps {
  params: Promise<{
    userId: string;
    roomId: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { userId, roomId } = await params;

  const cookieStore = await cookies();
  // Security check: Verify that the userId in the URL matches the one in cookies
  const cookieUserId = cookieStore.get("userId")?.value;

  if (!cookieUserId || cookieUserId !== userId) {
    // If there's a mismatch or no cookie, return 404
    return notFound();
  }

  return <Content roomId={roomId} userId={userId} />;
}
