import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSFX } from "@/hooks/use-sfx";
import { motion } from "motion/react";
import { Button } from "../ui/button";

interface Props {
  mappedSeq: Record<number, number>;
}
export const Pin = ({ mappedSeq }: Props) => {
  const [seq, setSeq] = useState<number[]>([]);

  const { sfxDarbuka: sfx } = useSFX({ interrupt: true, volume: 0.15 });
  const mappedEntry = useMemo(
    () => seq.map((s) => mappedSeq[s]),
    [seq, mappedSeq],
  );

  const sortedValues = useMemo(() => {
    const values = Object.entries(mappedSeq);
    const sorted = values.map(([, v]) => v).sort();
    return sorted;
  }, [mappedSeq]);

  const order = useCallback(
    (value: number) => sortedValues.findIndex((i) => i === value),
    [sortedValues],
  );

  const mappedCircles = useMemo(
    () =>
      circles.map((c) => ({
        ...c,
        value: mappedSeq[c.uid] && order(mappedSeq[c.uid] as number) + 1,
      })) as PinItem[],
    [order, mappedSeq],
  );

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

  const pin = useMemo(() => {
    const comparison =
      seq.length === 4 && matched(sortedValues.slice(), mappedEntry);
    return comparison;
  }, [seq, sortedValues, mappedEntry]);

  useEffect(() => {
    if (pin) console.log("PIN Correct");
    if (seq.length === 4 && !pin) setSeq([]);
  }, [pin, seq]);

  return (
    <div className="">
      <div className="h-fit w-full flex flex-col items-center justify-center">
        <div className="size-44 relative m-2">
          {mappedCircles.map((circle, idx) => {
            return (
              circle.id && (
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
                    delay: 1 + idx * 0.3,
                  }}
                  whileTap={{ scale: 0.8 }}
                >
                  <div
                    className={`size-14 flex items-center justify-center aspect-square rounded-full ${pin ? "bg-transparent" : "bg-neutral-200/30"}`}
                  >
                    <span
                      className={cn(
                        "text-xl select-none font-space drop-shadow-xs hidden",
                        { flex: circle.value },
                      )}
                    >
                      {circle.value}
                    </span>
                  </div>
                </motion.div>
              )
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
      <div className="h-40 w-full justify-center flex items-center">
        <Button onClick={getSortedSeq}>Get Sorted Sequence</Button>
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
    className="h-24 flex items-center"
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
      <span className="font-sans text-cyber-text-primary select-none">
        Guess the{" "}
        <span className="text-neutral-700 dark:text-cyan-50 font-semibold px-1.5">
          PIN
        </span>{" "}
        to unlock
      </span>
    )}
  </motion.div>
);

function matched<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

interface PinItem {
  id: string;
  uid: number;
  pos: string;
  value?: number;
  color?: string;
}
const circles: PinItem[] = [
  {
    id: "top-left",
    color: "bg-neutral-300",
    pos: "top-2 left-2",
    uid: 2,
  },
  {
    id: "top-right",
    color: "bg-neutral-300",
    pos: "top-2 right-2",
    uid: 3,
  },
  {
    id: "bottom-right",
    color: "bg-neutral-300",
    pos: "bottom-2 right-2", // bottom-right value: 2,
    uid: 5,
  },
  {
    id: "bottom-left",
    color: "bg-neutral-300",
    pos: "bottom-2 left-2", // bottom-left value: 3,
    uid: 8,
  },
];
