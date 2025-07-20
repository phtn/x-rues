import crypto from "crypto";
import { onError, onSuccess, onWarn } from "@/ctx/toast";
const s = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

export const guid = () =>
  `${s()}${s()}-${s()}-${s()}-${s()}-${s()}${s()}${s()}`;

export function gsec(length = 20) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    if (bytes[i]) {
      result += chars[bytes[i]! % chars.length];
    }
  }
  return result;
}

export const getInitials = (name?: string): string => {
  if (!name) return "";

  const words = name.split(" ");

  if (words.length === 1) {
    return name.slice(0, 2);
  }

  if (words.length === 2) {
    return words[0]!.charAt(0) + words[1]!.charAt(0);
  }

  // All possible `words.length` values (which must be >= 1 for a string `name`) are covered by the
  // preceding `if` conditions. Therefore, this `if` (length >= 3) covers the remaining cases,
  // meaning all code paths return a string. The original type annotation `string | undefined` was
  // misleading as `undefined` was never actually returned. Changing the return type to `string`
  // resolves the "Not all code paths return a value" diagnostic.
  if (words.length >= 3) {
    return words[0]!.charAt(0) + words[words.length - 1]!.charAt(0);
  }
  return "";
  // This line is unreachable because all cases for words.length are covered above.
  // However, TypeScript's control flow analysis sometimes needs an explicit return if the
  // exhaustive nature of conditions isn't fully inferred. By changing the return type to `string`,
  // the compiler understands that all explicit returns are `string`, thus satisfying the type.
};

export type CopyFnParams = {
  name: string;
  text: string;
  limit?: number;
};
type CopyFn = (params: CopyFnParams) => Promise<boolean>; // Return success
export const copyFn: CopyFn = async ({ name, text }) => {
  if (!navigator?.clipboard) {
    onWarn("Clipboard not supported");
    return false;
  }
  if (!text) return false;

  return await navigator.clipboard
    .writeText(text)
    .then(() => {
      onSuccess(`${name ? "Copied: " + name : "Copied."}`);
      return true;
    })
    .catch((e) => {
      onError(`Copy failed. ${e}`);
      return false;
    });
};
