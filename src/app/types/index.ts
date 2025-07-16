import type { HTMLProps } from "react";
export type ClassName = HTMLProps<HTMLElement>["className"];
export type { WebhookEvent, ConnectionStatus } from "@/app/types/webhooks";
export type {
  GitHubWebhookBase,
  GitHubWebhookPayload,
  PushEventPayload,
  PullRequestEventPayload,
} from "@/app/types/github";
