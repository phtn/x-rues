import { useState, useCallback } from "react";
import { Effect } from "effect";

/**
 * A custom hook that provides Effect-based state management
 *
 * @param initialState - The initial state
 * @returns A tuple with the current state and a dispatch function
 */
export function useEffectState<T extends Record<string, unknown>>(
  initialState: T,
) {
  const [state, setState] = useState<T>(initialState);

  const dispatch = useCallback((update: Partial<T>) => {
    // Use Effect to handle state updates
    Effect.runSync(
      Effect.sync(() => {
        setState((currentState) => ({
          ...currentState,
          ...update,
        }));
      }),
    );
  }, []);

  return [state, dispatch] as const;
}
