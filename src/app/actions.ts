"use server";

import { cookies } from "next/headers";

interface CookieOptions {
  path?: string;
  httpOnly?: boolean;
  sameSite?: boolean | "lax" | "strict" | "none";
  secure?: boolean;
  maxAge?: number;
}

type CookieType = "theme" | "darkMode" | "soundEnabled" | "userId";

type ValuesMap = {
  theme: string;
  soundEnabled: boolean;
  darkMode: boolean;
  userId: string;
};

interface Expiry {
  expires?: Date;
}

const cookieNameMap: Record<CookieType, string> = {
  theme: "x-rues-themes",
  darkMode: "dark-mode-enabled",
  soundEnabled: "sound-enabled",
  userId: "eph-user-id",
};

const defaults: CookieOptions = {
  path: "/",
  httpOnly: false,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

const cookieExpiryMap: Partial<Record<CookieType, number>> = {
  userId: 60 * 60 * 24 * 7, // 7 days
  theme: 60 * 60 * 24 * 365, // 1 year
  soundEnabled: 60 * 60 * 24 * 180, // 6 months
  darkMode: 60 * 60 * 24 * 30, // 30 days
};

/**
 * @name setCookie
 * @param CookieType
 * @param valuesMap
 * @param CookieOptions
 */
export const setCookie = async <T extends CookieType>(
  type: T,
  values: ValuesMap[T],
  options?: Partial<CookieOptions & Expiry>,
) => {
  const name = cookieNameMap[type];
  const store = await cookies();
  const value = JSON.stringify(values);
  const maxAge = options?.maxAge ?? cookieExpiryMap[type] ?? defaults.maxAge;
  store.set(name, value, { ...defaults, maxAge, ...options });
};

export const getCookie = async <T extends CookieType>(
  type: T,
): Promise<ValuesMap[T] | undefined> => {
  const name = cookieNameMap[type];
  const store = await cookies();
  const cookie = store.get(name);

  if (!cookie?.value) return undefined;

  try {
    return JSON.parse(cookie.value) as ValuesMap[T];
  } catch {
    // fallback if the value was stored without JSON
    return cookie.value as unknown as ValuesMap[T];
  }
};

export const deleteCookie = async (type: CookieType) => {
  const name = cookieNameMap[type];
  const store = await cookies();
  store.delete(name);
};
