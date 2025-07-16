import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { type ReactNode, useCallback, useState } from "react";
import { Cat } from "vx/cats/d";

interface Props {
  data: Cat[];
}
export const HyperTabs = ({ data }: Props) => {
  const [val, set] = useState<string>("apps");
  const [idx, setidx] = useState(0);

  const onClick = useCallback(
    (i: number) => () => {
      setidx(i);
      set(data[i].name);
      console.log(i, data[i].name);
    },
    [data],
  );

  return <OldTab data={data} idx={idx} val={val} fn={onClick} />;
};

interface TabsProps {
  val: string;
  idx: number;
  children?: ReactNode;
  data: Cat[];
  fn: (i: number) => () => void;
}
export const Tabs = ({ val, idx, fn, children, data }: TabsProps) => {
  return (
    <div
      className={cn(
        "h-16 w-full place-items-start rounded-xl py-3 ps-4 shrink-0",
        "from-zed/40 via-zed/30 to-transparent",
        "bg-accent mask-luminance mask-r-from-white mask-r-to-black",
        "dark:from-accent/10 dark:via-accent/10 dark:to-transparent ",
      )}
    >
      <RadioGroup
        dir="ltr"
        // onValueChange={set}
        className={cn(
          "group relative items-center h-10 flex justify-center after:-ml-20 after:gap-16",
          "after:transition-[transform, box-shadow] after:duration-300 outline-0",
          "has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 has-focus-visible:after:ring-[3px]",
          "after:absolute after:inset-y-0 after:w-1/5 after:rounded-lg after:bg-white",
          "after:shadow-sm shadow-muted dark:after:drop-shadow-md dark:after:inset-shadow-[0_0.75px_rgb(255_255_255/0.15)]",
          "dark:after:bg-void/60",
          "after:translate-x-[calc(var(--selected-index)*80%)] after:[cubic-bezier(0.12,0,0.39,0)]",
          `--selected-index: ${idx}`, // interesting
        )}
        // style={{ "--selected-index": idx } as CSSProperties}
        // defaultValue={val}
      >
        {children}
        {data?.map(({ name, icon }, i) => (
          <Label
            key={i}
            className={cn(
              "relative z-10 whitespace-nowrap transition-colors",
              "font-jet font-semibold text-base tracking-tight cursor-pointer capitalize",
              "inline-flex h-full items-center justify-center",
              "has-data-[state=unchecked]:text-muted-foreground dark:has-data-[state=unchecked]:text-background",
              "hover:has-data-[state=unchecked]:text-foreground",
              "items-center justify-evenly border-teal-50 px-2 space-x-2",
            )}
          >
            <Icon
              solid
              name={icon}
              className="size-5 shrink-0 dark:text-lime-200"
            />
            <span className="font-medium text-sm tracking-tight">{name}</span>
            <RadioGroupItem
              value={name}
              checked={name === val}
              onClick={fn(i)}
              className={cn(
                "h-full w-full shrink-0 shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 sr-only",
                "rounded-full ",
                "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary",
                "focus-visible:border-ring focus-visible:ring-ring/50",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              )}
            ></RadioGroupItem>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};

export const OldTab = ({ data, val, idx, fn }: TabsProps) => {
  const [selectedValue, setSelectedValue] = useState(val);
  return (
    <div className="bg-muted dark:bg-background/50 inline-flex h-8 rounded-full p-1 shrink-0">
      <RadioGroup
        // value={selectedValue}
        defaultValue={selectedValue}
        onValueChange={setSelectedValue}
        className={cn(
          "group relative items-center h-10 flex justify-center",
          "after:transition-[transform, box-shadow] after:duration-300 outline-0",
          "has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 has-focus-visible:after:ring-[3px]",
          "after:absolute after:inset-y-0 after:w-28 after:rounded-lg after:bg-white",
          "after:shadow-sm shadow-muted dark:after:drop-shadow-md dark:after:inset-shadow-[0_0.75px_rgb(255_255_255/0.15)]",
          "dark:after:bg-void/60",
          "after:translate-x-[calc(var(--selected-index)*100%)] after:[cubic-bezier(0.12,0,0.39,0)]",
          `--selected-index: ${idx}`, // interesting
        )}
      >
        {data.map((d, i) => (
          <ViewOption key={d.name} id={i} value={d.name} fn={fn} />
        ))}
      </RadioGroup>

      <span>{idx}</span>
    </div>
  );
};
interface ViewOptionProps {
  id: number;
  value: number;
  fn: (id: number) => () => void;
}
const ViewOption = ({ id, value, fn }: ViewOptionProps) => {
  return (
    <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-2 whitespace-nowrap transition-colors select-none uppercase text-foreground has-data-[state=unchecked]:text-muted-foreground">
      {value}
      <RadioGroupItem
        onClick={fn(id)}
        // checked={checked}
        className="sr-only"
        id={`${id}-${value}`}
        value={value.toString()}
      />
    </label>
  );
};

export const data = [
  {
    value: "apps",
  },
  {
    value: "libraries",
  },
  {
    value: "guides",
  },
  {
    value: "games",
  },
  {
    value: "posts",
  },
];
