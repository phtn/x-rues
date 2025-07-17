import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RoomsList from "./rooms-list";

interface RoomsPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function RoomsPage({ params }: RoomsPageProps) {
  const { userId } = await params;

  const cookieStore = await cookies();

  // Security check: Verify that the userId in the URL matches the one in cookies
  const cookieUserId = cookieStore.get("userId")?.value;

  if (!cookieUserId || cookieUserId !== userId) {
    // If there's a mismatch or no cookie, redirect to lobby
    redirect("/lobby");
  }

  return <RoomsList userId={userId} />;
}
