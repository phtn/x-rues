import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatListItemProps {
  user: {
    name: string
    status: string
    avatar: string
    role?: string
  }
}

export function ChatListItem({ user }: ChatListItemProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-light-card p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="font-medium text-light-text-primary">{user.name}</h3>
          <p className="text-sm text-light-text-secondary">{user.role || user.status}</p>
        </div>
      </div>
      {/* Removed EllipsisVertical button as requested */}
    </div>
  )
}
