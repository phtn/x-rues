import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Camera, Mic } from "lucide-react"

export function ChatInput() {
  return (
    <div className="flex items-center gap-3 rounded-full bg-light-grey-bubble p-3">
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-light-text-secondary">
        <Plus className="h-6 w-6" />
      </Button>
      <Input
        placeholder="Type something..."
        className="flex-1 border-none bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-light-text-secondary">
        <Camera className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-light-text-secondary">
        <Mic className="h-6 w-6" />
      </Button>
    </div>
  )
}
