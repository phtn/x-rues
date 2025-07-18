import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfileCardProps {
  user: {
    name: string
    status: string
    avatar: string
  }
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="relative flex items-center gap-4 rounded-3xl bg-light-purple-light p-5 shadow-sm">
      <Avatar className="h-14 w-14">
        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-light-text-primary">{user.name}</h2>
        <div className="flex items-center gap-1 text-sm text-light-text-secondary">
          <span className="h-2 w-2 rounded-full bg-light-purple" />
          <span>{user.status}</span>
        </div>
      </div>
      {/* Removed EllipsisVertical button as requested */}
    </div>
  )
}
