"use client";

import { useSFX } from "@/hooks/use-sfx";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { handleAsync } from "@/utils/async-handler";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCookie, setCookie } from "./actions";

interface Props {
  mappedSeq: Record<number, number>;
}
export const Content = ({ mappedSeq }: Props) => {
  const { sfxDarbuka: sfx } = useSFX({ interrupt: true, volume: 0.15 });

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

  const [seq, setSeq] = useState<number[]>([]);

  const mappedEntry = useMemo(
    () => seq.map((s) => mappedSeq[s]),
    [seq, mappedSeq],
  );

  const sortedValues = useMemo(() => {
    const values = Object.entries(mappedSeq);
    const sorted = values.map(([, v]) => v).sort();
    return sorted;
  }, [mappedSeq]);

  const getSortedSeq = useCallback(() => {
    console.table({ sortedValues });
    console.table({ mappedSeq });
    setSeq([]);
  }, [mappedSeq, sortedValues]);

  const fx = useCallback(
    (uid: number) => () => {
      const playbackRate = uid * 0.8;
      sfx({ playbackRate });

      setSeq((prev) => {
        if (prev.length < 4) {
          if (!prev.includes(uid)) {
            return [...prev, uid];
          }
          return [...prev];
        }
        return [];
      });
    },
    [sfx],
  );

  const order = useCallback(
    (value: number) => sortedValues.findIndex((i) => i === value),
    [sortedValues],
  );

  const pin = useMemo(() => {
    const comparison =
      seq.length === 4 && matched(sortedValues.slice(), mappedEntry);
    return comparison;
  }, [seq, sortedValues, mappedEntry]);

  useEffect(() => {
    if (pin) console.log("PIN Correct");
    if (seq.length === 4 && !pin) setSeq([]);
  }, [pin, seq]);

  const circles = [
    {
      id: "top-left",
      color: "bg-neutral-300",
      pos: "top-2 left-2",
      value: mappedSeq[2],
      uid: 2,
      delay: 0,
    },
    {
      id: "top-right",
      color: "bg-neutral-300",
      pos: "top-2 right-2",
      value: mappedSeq[3],
      uid: 3,
      delay: 0.2,
    },
    {
      id: "bottom-right",
      color: "bg-neutral-300",
      pos: "bottom-2 right-2", // bottom-right value: 2,
      value: mappedSeq[5],
      uid: 5,
      delay: 0.4,
    },
    {
      id: "bottom-left",
      color: "bg-neutral-300",
      pos: "bottom-2 left-2", // bottom-left value: 3,
      value: mappedSeq[8],
      uid: 8,
      delay: 0.6,
    },
  ];

  return (
    <div className="flex items-center justify-center pb-[calc(42lvh)]">
      <div className="flex flex-col items-center space-y-20">
        {/* Logo Section */}
        <motion.div
          onClick={getSortedSeq}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <Icon
            solid
            name="rues-chat-logo"
            className="size-5 md:size-8 text-slate-500 mb-3"
          />
          <h1 className="font-mono font-semibold text-slate-700 text-2xl md:text-5xl">
            rues
          </h1>
        </motion.div>

        {/* Animated Quadrant - Centered on both mobile and desktop */}
        <div className="flex justify-center w-full">
          {/* Quadrant Container - 160x160px (80x80 per quadrant) */}
          <div className="size-40 relative m-2">
            {circles.map((circle) => {
              return (
                <motion.div
                  onClick={fx(circle.uid)}
                  key={circle.id}
                  className={`absolute size-16 border-none rounded-full p-1 aspect-square flex items-center justify-center  ${circle.pos} ${seq.includes(circle.uid) && !pin ? "pointer-events-none bg-sky-500 text-white" : "pointer-events-auto"} ${pin && "bg-emerald-400 pointer-events-none text-white"}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    scale: {
                      type: "spring",
                      visualDuration: 0.4,
                      bounce: 0.6,
                    },
                    delay: circle.delay,
                  }}
                  whileTap={{ scale: 0.8 }}
                >
                  <div
                    className={`size-14 flex items-center justify-center aspect-square rounded-full ${pin ? "bg-transparent" : "bg-neutral-200/30"}`}
                  >
                    <span className="text-xl select-none font-light font-space">
                      {order(circle.value) + 1}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Optional: Quadrant divider lines (subtle) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Vertical line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[0.33px] bg-neutral-400/40 transform translate-x-[0.33px]" />
              {/* Horizontal line */}
              <div className="absolute top-1/2 left-0 right-0 h-[0.33px] bg-neutral-400/40 transform -translate-y-[0.33px]" />
            </div>
          </div>
        </div>

        {/* Navigation Link */}
        <ToLobby pin={pin} />
      </div>
    </div>
  );
};

const ToLobby = ({ pin }: { pin: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      type: "spring",
      visualDuration: 0.6,
      bounce: 0.6,
      delay: 0.8,
    }}
  >
    {pin ? (
      <Link href={pin ? "/lobby" : "#"}>
        <div className="group flex items-center gap-2 text-neutral-500 hover:text-neutral-700 transition-colors">
          <span className="font-sans text-sm">
            <span className=" tracking-tight">to</span>{" "}
            <span className="text-neutral-700 font-mono font-medium">
              Lobby
            </span>
          </span>

          <motion.span
            className={cn("text-lg -mb-1 hidden", { flex: pin })}
            animate={{ x: [0, 4, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            →
          </motion.span>
        </div>
      </Link>
    ) : (
      <span className="font-sans tracking-tight text-sm select-none">
        Guess the <span className="text-neutral-700 font-semibold">PIN</span> to
        unlock
      </span>
    )}
  </motion.div>
);

function matched<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}
