import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/icons";

export function DesktopChatInput() {
  return (
    <div className="flex items-center gap-5 rounded-t-xl rounded-b-sm border border-cyber-border bg-cyber-card p-3 shadow-lg shadow-cyber-blue/5 h-24">
      <Input
        placeholder="Your message"
        className="flex-1 h-16 border-none bg-transparent rounded-b-[6px] text-base text-cyber-text-primary placeholder:text-cyber-text-secondary focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <Button
        size="icon"
        variant="ghost"
        className="h-10 w-10 rounded-lg text-cyber-text-secondary hover:text-cyber-blue"
      >
        <Icon solid name="px-paperclip" className="size-6 -rotate-45" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-md bg-cyber-blue shadow-md shadow-cyber-blue/40 hover:bg-white"
      >
        <Icon solid name="px-arrow-up" className="size-8 text-cyber-panel " />
      </Button>
    </div>
  );
}
