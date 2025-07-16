import { User } from "@/app/lobby/chat/types";
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
      className="w-full max-w-sm aspect-square rounded-full border-2 m-1 h-fit size-full border-chalk/40 shadow-inner bg-radial-[at_0%_60%] overflow-hidden dark:from-slate-200 dark:via-slate-300/80 dark:to-slate-100 px-8 pt-10 pb-7"
    >
      <div className="w-full flex items-start justify-start size-full">
        <div className="mb-10 w-full flex flex-col">
          <p className="text-xs font-normal uppercase tracking-wider text-muted-foreground dark:text-slate-700">
            {id}
          </p>
          <h2 className="mt-2 text-2xl font-bold font-ox tracking-tighter text-foreground dark:text-slate-800">
            {name}
          </h2>
        </div>
        <div className="flex-1 relative">
          <span className="cursor-pointer rounded-full hover:bg-origin relative -top-4 -right-3 p-1">
            <Icon
              solid
              name="px-arrow-up"
              className="size-7 shrink-0 rotate-45 dark:text-lime-200 text-red-200"
            />
          </span>
        </div>
      </div>
    </button>
  );
};
