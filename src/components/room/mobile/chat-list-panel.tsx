import { UserProfileCard } from "../components/user-profile-card";
import { ChatListItem } from "./chat-list-item";
import { users } from "../data";
import { ChevronRight, Bookmark } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatListPanel() {
  const currentUser = users[0]; // Pedrik Ronner
  const topPeople = users.slice(1, 5); // Elena, Marie, Oskar, Nora

  return (
    <ScrollArea className="h-full p-4">
      <div className="flex h-full flex-col gap-6">
        <UserProfileCard user={currentUser} />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-light-text-primary">
              Top People
            </h2>
            <button className="text-sm font-medium text-light-text-secondary">
              See all
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {topPeople.map((user) => (
              <ChatListItem key={user.id} user={user} />
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between rounded-3xl bg-light-purple-light p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-light-purple text-white">
              <Bookmark className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-light-text-primary">
                Favourite List
              </h3>
              <p className="text-sm text-light-text-secondary">
                Last update: 28July 23
              </p>
            </div>
          </div>
          <ChevronRight className="h-6 w-6 text-light-text-secondary" />
        </div>
      </div>
    </ScrollArea>
  );
}
