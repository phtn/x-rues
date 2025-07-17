"use client";

import useSound from "use-sound";

export type HookOptions<T = unknown> = T & {
  id?: string;
  volume?: number;
  playbackRate?: number;
  interrupt?: boolean;
  soundEnabled?: boolean;
  sprite?: number[];
  onload?: VoidFunction;
};
/**
 * @name useSFX
 * @returns PlayFunction
 *
 * @example
 * ```typescript
 * // declare hook
 * const {switchOn, switchOff, toggle} = useSFX()
 *
 * // usage
 * const onToggle = useCallback(() => {
 *  toggle()
 * }, [toggle])
 * ```
 * @dependency use-sound by Josh Comeau
 * @link https://github.com/joshwcomeau/use-sound
 */

export const useSFX = ({
  playbackRate,
  volume,
  interrupt,
  soundEnabled,
}: HookOptions) => {
  const opts = {
    volume: volume ?? 0.25,
    interrupt: interrupt ?? true,
    playbackRate: playbackRate ?? 0.5,
    soundEnabled: soundEnabled ?? true,
  };

  const [sfxDarbuka] = useSound("/sfx/darbuka.wav", opts);
  const [sfxArrival] = useSound("/sfx/arrival.mp3", opts);

  return {
    sfxArrival,
    sfxDarbuka,
  };
};
