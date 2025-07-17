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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Room: {roomId}</h1>
      <div className="bg-neutral-100 rounded-lg p-6">
        <p className="text-gray-700">
          You are viewing room {roomId} as user {userId}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Note: The userId is hidden from the URL in the browser address bar
        </p>
      </div>

      <Content roomId={roomId} userId={userId} />
    </div>
  );
}
