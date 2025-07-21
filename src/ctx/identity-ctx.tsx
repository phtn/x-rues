"use client";

import { getCookie, setCookie } from "@/app/actions";
import { handleAsync } from "@/utils/async-handler";
import {
  createContext,
  useMemo,
  useContext,
  type ReactNode,
  useCallback,
  useState,
  useRef,
  RefObject,
} from "react";
import { onInfo } from "./toast";
import { getDeviceProfile } from "@/utils/fingerprint";
import { Identity } from "@semaphore-protocol/identity";

interface IdentityProviderProps {
  children: ReactNode;
}

interface IdentityCtxValues {
  fingerprint: string | undefined;
  getStoredFingerprint: () => Promise<void>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  identity: Identity | undefined;
}

const IdentityCtx = createContext<IdentityCtxValues | null>(null);

const IdentityCtxProvider = ({ children }: IdentityProviderProps) => {
  const [fingerprint, setFingerprint] = useState<string>();
  const [identity, setIdentity] = useState<Identity>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const createNewIdentity = useCallback(async () => {
    if (canvasRef.current) {
      const device = await handleAsync(getDeviceProfile)(canvasRef.current);
      if (device.data?.fingerprintId) {
        const _identity = new Identity(device.data.fingerprintId);
        setIdentity(_identity);
        await handleAsync(setCookie)("fingerprint", device.data.fingerprintId);
        await handleAsync(setCookie)("identity", _identity);
      }
    }
  }, []);

  const getStoredFingerprint = useCallback(async () => {
    const { data } = await handleAsync(getCookie)("fingerprint");
    if (data) {
      setFingerprint(data);
      const _identity = Identity.import(data);
      setIdentity(_identity);
    } else {
      onInfo("New device detected.");
      createNewIdentity().catch(console.error);
    }
  }, [createNewIdentity]);

  const value = useMemo(
    () => ({
      fingerprint,
      getStoredFingerprint,
      canvasRef,
      identity,
    }),
    [fingerprint, getStoredFingerprint, canvasRef, identity],
  );
  return <IdentityCtx value={value}>{children}</IdentityCtx>;
};

const useIdentityCtx = () => {
  const ctx = useContext(IdentityCtx);
  if (!ctx) throw new Error("IdentityCtxProvider is missing");
  return ctx;
};

export { IdentityCtx, IdentityCtxProvider, useIdentityCtx };
