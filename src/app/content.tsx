"use client";

import { Icon } from "@/lib/icons";
import Link from "next/link";

export const Content = () => {
  return (
    <div className="size-64 flex items-center justify-center">
      <div className="space-x-2 flex flex-col items-center">
        <div className="h-20 flex items-center gap-3">
          <Icon name="chat-logo" className="size-9 text-neutral-400" />
          <h1 className="font-mono font-semibold text-5xl">rues</h1>
        </div>

        <Link href={"/lobby"}>
          <h2 className="h-12 font-sans tracking-wider text-neutral-500 flex items-center text-sm">
            to lobby &nbsp; &rarr;
          </h2>
        </Link>
      </div>
    </div>
  );
};
