import { User } from "@/components/chat/types";
import { Icon } from "@/lib/icons";
import { useCallback } from "react";

export interface ChatHead extends User {
  fn: (id: string) => void;
}
export const RoundCard = ({ name, id, fn }: ChatHead) => {
  const handleLogin = useCallback(async () => {
    fn(id);
  }, [fn, id]);
  return (
    <button
      onClick={handleLogin}
      className="w-full md:max-w-sm aspect-square rounded-full md:m-1 size-24 md:size-40 bg-neutral-100 p-4 md:px-8 md:pt-10 md:pb-7"
    >
      <div className="w-full flex items-start justify-start size-full">
        <div className="w-full flex flex-col">
          <h2 className="md:space-y-2 space-y-2 flex flex-col items-center text-base md:text-2xl font-semibold font-ox tracking-tighter text-foreground dark:text-neutral-700">
            <Icon
              solid
              name="ninja-head"
              className="md:size-10 size-6 shrink-0 text-neutral-400"
            />
            <span className="font-normal font-mono text-sm">{name}</span>
          </h2>
        </div>
      </div>
    </button>
  );
};
