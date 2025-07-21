"use client";

import { getCookie } from "@/app/actions";
import { ThemeProvider } from "@/components/theme-provider";
import { configureEffect } from "@/lib/effect/config";
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
import { Toasts } from "./toast";
import { IdentityCtxProvider } from "./identity-ctx";

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
    configureEffect();
    console.log("Effect in effect.");
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
    <ProviderCtx.Provider value={value}>
      <ThemeProvider
        enableSystem
        attribute="class"
        defaultTheme={defaultMode ?? "system"}
        disableTransitionOnChange
      >
        <IdentityCtxProvider>{children}</IdentityCtxProvider>
      </ThemeProvider>

      <Toasts />
    </ProviderCtx.Provider>
  );
};

const useProviderCtx = () => {
  const ctx = useContext(ProviderCtx);
  if (!ctx) throw new Error("ProviderCtxProvider is missing");
  return ctx;
};

export { ProviderCtx, ProviderCtxProvider, useProviderCtx };
