// types/webhook.ts
export interface WebhookEvent {
  id: string;
  timestamp: string;
  eventType: string;
  isValid: boolean;
  repository: string;
  sender: string;
  data: {
    action?: string;
    ref?: string;
    commitCount?: number;
    pullRequestNumber?: number;
    pullRequestTitle?: string;
    url?: string;
  };
  error?: string;
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export interface ReviewData {
  prInfo: {
    title: string;
    description: string;
    author: string;
    number: number;
  };
  repository: {
    name: string;
    owner: string;
  };
  changes: Array<{
    filename: string;
    status: string;
    diff: string;
    fullContent?: string;
    stats: {
      additions: number;
      deletions: number;
    };
  }>;
}
