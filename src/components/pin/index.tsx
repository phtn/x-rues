import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { useSFX } from "@/hooks/use-sfx";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Effect } from "effect";
import { useEffectState } from "./use-effect-state";

interface Props {
  mappedSeq: Record<number, number>;
}

// Define our core types
type PinState = {
  seq: number[];
  pin: boolean;
};

// Define our Effect-based operations
const pinOperations = {
  // Check if the sequence matches the expected pattern
  checkPin: (
    seq: number[],
    sortedValues: number[],
    mappedEntry: number[],
  ): boolean => {
    return Effect.runSync(
      Effect.sync(() => {
        if (seq.length !== 4) return false;
        return seq.length === 4 && matched(sortedValues.slice(), mappedEntry);
      }),
    );
  },

  // Add a number to the sequence if valid
  addToSequence: (seq: number[], uid: number): number[] => {
    return Effect.runSync(
      Effect.sync(() => {
        if (seq.length >= 4) return [];
        if (seq.includes(uid)) return seq;
        return [...seq, uid];
      }),
    );
  },

  // Calculate sorted values from mappedSeq
  getSortedValues: (mappedSeq: Record<number, number>): number[] => {
    return Effect.runSync(
      Effect.sync(() => {
        const values = Object.entries(mappedSeq);
        return values.map(([, v]) => v).sort();
      }),
    );
  },

  // Calculate order of a value in sorted array
  getOrder: (value: number, sortedValues: number[]): number => {
    return Effect.runSync(
      Effect.sync(() => sortedValues.findIndex((i) => i === value)),
    );
  },
};

export const Pin = ({ mappedSeq }: Props) => {
  // Use our custom Effect-based state hook
  const [state, dispatch] = useEffectState<PinState>({
    seq: [],
    pin: false,
  });

  const { sfxDarbuka: sfx } = useSFX({ interrupt: true, volume: 0.15 });

  // Calculate derived values using Effect
  const sortedValues = useMemo(
    () => pinOperations.getSortedValues(mappedSeq),
    [mappedSeq],
  );

  // This is used in the checkPin function via the fx callback
  const mappedEntry = useMemo(
    () => state.seq.map((s) => mappedSeq[s] as number),
    [state.seq, mappedSeq],
  );

  const order = useCallback(
    (value: number) => pinOperations.getOrder(value, sortedValues),
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

  // Handle sequence reset
  // const getSortedSeq = useCallback(() => {
  //   console.table({ sortedValues });
  //   console.table({ mappedSeq });
  //   dispatch({ seq: [] });
  // }, [mappedSeq, sortedValues, dispatch]);

  // Handle circle click with Effect
  const fx = useCallback(
    (uid: number) => () => {
      const playbackRate = uid * 0.8;
      sfx({ playbackRate });

      // Update sequence using Effect
      dispatch({
        seq: pinOperations.addToSequence(state.seq, uid),
      });

      // Check if pin is correct after update
      if (state.seq.length === 3 && !state.seq.includes(uid)) {
        const newSeq = [...state.seq, uid];
        // Use the new sequence with the updated mappedEntry
        const newMappedEntry = [...mappedEntry, mappedSeq[uid]] as number[];
        const isPinCorrect = pinOperations.checkPin(
          newSeq,
          sortedValues,
          newMappedEntry,
        );

        if (isPinCorrect) {
          dispatch({ pin: true });
          console.log("PIN Correct");
        } else if (newSeq.length === 4) {
          // Reset sequence if incorrect and length is 4
          setTimeout(() => dispatch({ seq: [] }), 500);
        }
      }
    },
    [sfx, state.seq, sortedValues, mappedSeq, dispatch, mappedEntry],
  );

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
                  className={`absolute size-16 border-none rounded-full p-1 aspect-square flex items-center justify-center  ${circle.pos} ${state.seq.includes(circle.uid) && !state.pin ? "pointer-events-none bg-sky-500 text-white" : "pointer-events-auto"} ${state.pin && "bg-emerald-400 font-bold pointer-events-none text-white"}`}
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
                    delay: idx * 0.3,
                  }}
                  whileTap={{ scale: 0.8 }}
                >
                  <div
                    className={`size-14 flex items-center justify-center aspect-square rounded-full ${state.pin ? "bg-transparent" : "bg-neutral-200/30"}`}
                  >
                    <span
                      className={cn(
                        "text-xl select-none font-space drop-shadow-sm hidden",
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
      <ToLobby pin={state.pin} />
      <div className="h-40 w-full justify-center flex items-center"></div>
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
    className="h-40 flex items-center justify-center"
  >
    {pin ? (
      <Link href={pin ? "/lobby" : "#"}>
        <Button variant="secondary" size="lg" asChild>
          {/* <div className="group flex items-center gap-2 text-neutral-500 hover:text-neutral-700 transition-colors"> */}
          <div className="font-sans">
            <span className="text-cyan-100 font-medium flex items-center space-x-4 drop-shadow-[0_0_4px_rgba(0,250,255,0.4)]">
              <span>Lobby</span>
              <motion.span
                className={cn("text-lg hidden", { flex: pin })}
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                →
              </motion.span>
            </span>
          </div>
        </Button>
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
