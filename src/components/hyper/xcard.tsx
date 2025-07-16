"use client";

import { Icon } from "@/lib/icons";
import { HyperList } from "./list";
import { cn } from "@/lib/utils";
import { PrefetchLink } from "./prefetch";

export interface XCardProps {
  idx: number;
  name: string;
  label: string;
  value: number;
  href: string;
  grp?: string;
  subitems: ICardSubItem[];
}
export const XCard = <T extends XCardProps>({
  name,
  grp,
  href,
  subitems,
}: T) => {
  // const diss = useCallback((idx: number) => dis({ id: "dis" }), [dis]);
  // ed.duration = 0.002;

  // useEffect(() => {
  //   // swipe(idx);
  //   // if (idx) {
  //   //   swipe(idx);
  //   // }
  //   return () => swipe(idx);
  // }, [idx, swipe]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     console.log(idx);
  //   }, 100);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [swipe, idx, up]);
  return (
    <div className="w-full max-w-sm rounded-[2rem] border-4 m-1 h-fit size-full dark:border-origin/20 border-chalk/40 shadow-inner shadow/20 dark:bg-background bg-radial-[at_30%_60%] overflow-hidden from-slate-600/80 via-slate-600/80 to-slate-700/60 dark:from-origin dark:via-origin/40 dark:to-background/60 px-8 pt-10 pb-7">
      <div className="w-full flex items-start justify-start size-full">
        <div className="mb-10 w-full flex flex-col">
          <p className="text-xs font-normal uppercase tracking-wider dark:text-muted-foreground text-chalk/60">
            {grp}
          </p>
          <h2 className="mt-2 text-2xl font-bold font-ox tracking-tighter dark:text-foreground text-chalk">
            {name}
          </h2>
        </div>
        <div className="flex-1 relative">
          <PrefetchLink href={`/init/${href}`}>
            <div
              role="link"
              className="cursor-pointer rounded-full hover:bg-origin relative -top-4 -right-3 p-1"
            >
              <Icon
                solid
                name="px-arrow-up"
                className="size-7 shrink-0 rotate-45 dark:text-lime-200 text-red-200"
              />
            </div>
          </PrefetchLink>
        </div>
      </div>

      <HyperList data={subitems} component={CardSubItem} />

      {/* <div className="flex tracking-tight items-center py-2 text-base">
        <div className="size-3 aspect-square flex-shrink-0 rounded-full bg-teal-600" />
        <span className="ml-3 text-cream/90">Delivered</span>
        <span className="ml-auto dark:text-muted-foreground">22,486</span>
        <span className="ml-3 font-semibold text-teal-600">86%</span>
      </div> */}
    </div>
  );
};

interface ICardSubItem {
  label: string;
  path: string;
  status?: "active" | "enabled" | "disabled" | "inactive";
  k: string;
  v: string | number | boolean;
}
const CardSubItem = (sub: ICardSubItem) => (
  <div className="group/item">
    <div className="flex tracking-tight items-center border border-black py-2 text-base">
      <div
        className={cn(
          "size-2.5 aspect-square flex-shrink-0 rounded-full bg-orange-300",
          { "bg-origin": sub.status === "disabled" },
        )}
      />
      <span
        className={cn(
          "ml-3 text-base tracking-tight font-medium text-muted-foreground",
          {
            "text-muted-foreground": sub.status === "disabled",
          },
        )}
      >
        {sub.label}
      </span>
      <span className="ml-auto font-light opacity-0 dark:text-muted-foreground">
        {sub.k}
      </span>
      <span className="ml-3 font-light tracking-wide text-sm font-mono text-foreground dark:text-cyan-200">
        {sub.v}
      </span>
    </div>
    <div
      className={cn(
        "my-1 h-[3px] rounded-full dark:bg-origin/40 bg-muted/35 flex group-last/item:[&>span]:hidden -mx-3",
        "",
      )}
    />
  </div>
);
