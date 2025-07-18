"use client";

import { getCookie } from "@/app/actions";
import { ThemeProvider } from "@/components/theme-provider";
import { handleAsync } from "@/utils/async-handler";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ProviderProviderProps {
  children: ReactNode;
}

interface ProviderCtxValues {
  on: boolean;
}

const ProviderCtx = createContext<ProviderCtxValues | null>(null);

const ProviderCtxProvider = ({ children }: ProviderProviderProps) => {
  const [defaultMode, setDefaultMode] = useState("dark");
  const getTheme = useCallback(async () => {
    const { data, error } = await handleAsync(getCookie)("theme");
    if (data) setDefaultMode(decodeURI(data));
    if (error) console.error(error);
  }, []);

  useEffect(() => {
    getTheme().catch(console.error);
  }, [getTheme]);
  const value = useMemo(
    () => ({
      on: false,
    }),
    [],
  );
  return (
    <ProviderCtx value={value}>
      <ThemeProvider
        enableSystem
        attribute="class"
        defaultTheme={defaultMode ?? "system"}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ProviderCtx>
  );
};

const useProviderCtx = () => {
  const ctx = useContext(ProviderCtx);
  if (!ctx) throw new Error("ProviderCtxProvider is missing");
  return ctx;
};

export { ProviderCtx, ProviderCtxProvider, useProviderCtx };
