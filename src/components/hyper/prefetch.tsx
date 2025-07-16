"use client";

import { type ClassName } from "@/app/types";
import Link, { type LinkProps } from "next/link";
import { type ReactNode, useCallback, useState } from "react";

export const PrefetchLink = (
  props: LinkProps & { className?: ClassName; children?: ReactNode },
) => {
  const [active, setActive] = useState(false);
  const onEnter = useCallback(() => {
    console.log("yo");
    setActive(true);
  }, []);
  return (
    <Link
      {...props}
      onMouseEnter={onEnter}
      className={props.className}
      prefetch={active ? null : false}
    />
  );
};
