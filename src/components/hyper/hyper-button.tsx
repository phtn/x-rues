"use client";

import { ClassName } from "@/app/types";
import { useSFX } from "@/hooks/use-sfx";
import { Icon, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type ReactNode, useCallback, useId } from "react";

interface HyperButtonProps {
  fn?: VoidFunction;
  label?: string;
  icon?: IconName;
  size?: number;
  solid?: boolean;
  iconStyle?: ClassName;
  className?: ClassName;
  children?: ReactNode;
  asChild?: boolean;
  disabled?: boolean;
}
export const HyperButton = ({
  fn,
  icon,
  label,
  children,
  className,
  iconStyle,
  size = 16,
  solid = false,
  asChild = false,
  disabled = false,
}: HyperButtonProps) => {
  const id = useId();
  const { sfxDarbuka: fx } = useSFX({ playbackRate: 1.15, volume: 0.2 });
  const handleClick = useCallback(() => {
    fx();
    if (fn) fn();
  }, [fx, fn]);

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      id={id}
      data-slot="button"
      disabled={disabled}
      className={cn(
        "flex items-center justify-center whitespace-nowrap bg-card px-2",
        "will-change-transform transition-all duration-300 ease-[cubic-bezier(0.37,0,0.63,1)] active:scale-[98%]",
        "dark:shadow-[0px_0px_0px_1px_theme(colors.black/4%),0_1px_1px_theme(colors.black/8%),0_1px_1px_theme(colors.black/8%),0_2px_4px_theme(colors.black/8%)]",
        "shadow-[0px_0px_0px_1px_theme(colors.black/3%),0_1px_1.5px_theme(colors.black/3%),0_1px_1.5px_theme(colors.black/3%),0_1.5px_2.5px_theme(colors.black/4%)]",
        "dark:inset-shadow-[0.20px_0.60px_0.2px_0.8px_theme(colors.white/16%)] dark:hover:inset-shadow-[0.20px_0.65px_0.2px_0.8px_theme(colors.white/25%)] dark:hover:bg-background dark:bg-background/65",
        "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "hover:bg-background hover:border-xy/60 hover:text-accent-foreground dark:hover:border-card-origin/30",
        "transition-[colors, shadow] duration-300 disabled:pointer-events-none disabled:opacity-50",
        "aria-disabled:pointer-events-none aria-disabled:text-muted-foreground/50",
        "rounded-md border-[0.5px] border-xy/60 dark:border-xy",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 w-fit h-9",
        "cursor-pointer disabled:cursor-auto",
        { "space-x-3": icon && !asChild },
        className,
        { "px-2.5": !label },
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 capitalize">
        {icon && (
          <Icon
            size={size}
            name={icon}
            solid={solid}
            className={cn(
              "shrink-0 select-none size-[0.94rem] text-muted-foreground/60 dark:text-teal-50/60",
              iconStyle,
            )}
          />
        )}
        {label && (
          <span className="select-none font-medium tracking-tight text-sm font-sans">
            {label}
          </span>
        )}
        {children}
      </div>
    </Comp>
  );
};
