import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function RoomsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const cookieStore = await cookies();
  const cookieUserId = cookieStore.get("userId")?.value;
  const { userId } = await params;

  if (!cookieUserId || cookieUserId !== userId) {
    // If there's a mismatch or no cookie, return 404
    return notFound();
  }

  return <div className="h-full">{children}</div>;
}
