"use client";

import { Pin } from "@/components/pin";
import { useIdentityCtx } from "@/ctx/identity-ctx";
import { handleAsync } from "@/utils/async-handler";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect } from "react";
import { getCookie, setCookie } from "./actions";

interface Props {
  mappedSeq: Record<number, number>;
}
export const Content = ({ mappedSeq }: Props) => {
  const { getStoredFingerprint, canvasRef } = useIdentityCtx();
  const { setTheme } = useTheme();

  useEffect(() => {
    handleAsync(getCookie)("theme")
      .then((v) => {
        if (!v) {
        }
        setTheme("dark");
        handleAsync(setCookie)("theme", "dark").catch(console.error);
      })
      .catch(console.error);
  }, [setTheme]);

  useEffect(() => {
    getStoredFingerprint().catch(console.error);
  }, [getStoredFingerprint]);

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-36 md:h-56 flex items-center gap-3"
        >
          <Image
            alt="rues-chat-logo"
            src="/rues_v5.svg"
            width={100}
            height={100}
            unoptimized
            priority
            className=" bg-cyber-text-secondary/50 h-6 md:h-10 rounded-full w-auto aspect-square object-cover text-slate-500 mb-4"
          />
          <h1 className="font-mono text-cyber-text-primary text-2xl md:text-5xl">
            rues
          </h1>
        </motion.div>
        <Pin mappedSeq={mappedSeq} />
        <div className="flex items-center space-x-16">
          <div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        </div>
      </div>
    </div>
  );
};
