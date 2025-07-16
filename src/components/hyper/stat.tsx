import { Icon } from "@/lib/icons";
import { HyperList } from "./list";
import { cn } from "@/lib/utils";

export interface HyperStatProps {
  group: string;
  label: string;
  value: number;
  path: string;
  desc?: string;
  subitems: IStatSubItem[];
}
export const HyperStat = ({ group, label, subitems }: HyperStatProps) => {
  return (
    <div className="w-full max-w-sm rounded-[2.5rem] border-4 dark:border-origin/64 border-slate-300/20 shadow-2xs dark:bg-background bg-radial-[at_20%_40%] from-slate-400/25 to-slate-200/10 px-8 pt-10 pb-7">
      <div className="w-full flex items-start justify-start">
        <div className="mb-10 w-full flex flex-col">
          <p className="text-xs font-normal uppercase tracking-wider dark:text-muted-foreground/80 text-cream">
            {group}
          </p>
          <h2 className="mt-1 text-3xl tracking-tight dark:text-foreground text-mac-blue">
            {label}
          </h2>
        </div>
        <div className="flex-1">
          <Icon
            solid
            name="arrow-right"
            className="size-5 shrink-0 -rotate-45 dark:text-lime-200 text-muted-foreground"
          />
        </div>
      </div>

      <HyperList data={subitems} component={StatSubItem} />

      {/* <div className="flex tracking-tight items-center py-2 text-base">
        <div className="size-3 aspect-square flex-shrink-0 rounded-full bg-teal-600" />
        <span className="ml-3 text-cream/90">Delivered</span>
        <span className="ml-auto dark:text-muted-foreground">22,486</span>
        <span className="ml-3 font-semibold text-teal-600">86%</span>
      </div> */}
    </div>
  );
};

interface IStatSubItem {
  label: string;
  path: string;
  status?: "active" | "enabled" | "disabled" | "inactive";
  k: string;
  v: string | number | boolean;
}
const StatSubItem = (sub: IStatSubItem) => (
  <div className="group/item">
    <div className="flex tracking-tight items-center py-2 text-base">
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
