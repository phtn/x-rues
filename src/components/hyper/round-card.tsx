import { User } from "@/components/chat/types";
import { Icon } from "@/lib/icons";
import { useCallback } from "react";
import { CyberAvatar } from "../avatar-gen/gen";

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
      className="w-full md:max-w-sm aspect-square flex items-center justify-center rounded-full overflow-hidden size-24 md:size-40 bg-cyber-bg"
    >
      <CyberAvatar publicKey={id} />
      {/* <div className="w-full flex items-start justify-start size-full">
        <div className="w-full flex flex-col">
          <h2 className="flex flex-col items-center justify-center text-base md:text-2xl font-semibold font-ox tracking-tighter text-foreground dark:text-neutral-700">
            <Icon
              solid
              name="ninja-head"
              className="md:size-10 size-6 shrink-0 text-neutral-400"
            />
            <span className="font-normal font-mono text-sm">{name}</span>
          </h2>
        </div>
      </div> */}
    </button>
  );
};
