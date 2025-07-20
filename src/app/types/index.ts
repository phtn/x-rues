import type { HTMLProps } from "react";
export type ClassName = HTMLProps<HTMLElement>["className"];
export type { WebhookEvent, ConnectionStatus } from "@/app/types/webhooks";
export type {
  GitHubWebhookBase,
  GitHubWebhookPayload,
  PushEventPayload,
  PullRequestEventPayload,
} from "@/app/types/github";

export type DeviceProfile = {
  userAgent: string;
  cores: number | null;
  screen: {
    width: number;
    height: number;
    pixelRatio: number;
  };
  hasTouch: boolean;
  timezone: string;
  fingerprintId: string;
  canvasText?: string;
};

export type Device = DeviceProfile | null;
