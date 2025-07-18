"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider & { toggleTheme: VoidFunction }>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
