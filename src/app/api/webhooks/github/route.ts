import type {
  GitHubWebhookPayload,
  PullRequestEventPayload,
  PushEventPayload,
  WebhookEvent,
} from "@/app/types";
import { handlePullRequestEvent } from "@/lib/webhooks/handlers";
import { webhookStore } from "@/lib/webhooks/store";
import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";

function createWebhookEvent(
  eventType: string,
  payload: GitHubWebhookPayload,
  isValid: boolean,
  error?: string,
): WebhookEvent {
  const baseEvent: WebhookEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    eventType,
    isValid,
    repository: payload.repository.full_name,
    sender: payload.sender.login,
    data: {
      action: payload.action,
    },
    error,
  };

  // Add event-specific data
  if (eventType === "push" && "commits" in payload) {
    baseEvent.data.ref = payload.ref;
    baseEvent.data.commitCount = payload.commits.length;
    // baseEvent.data.url = payload.repository.url;
  } else if (eventType === "pull_request" && "pull_request" in payload) {
    baseEvent.data.pullRequestNumber = payload.pull_request.number;
    baseEvent.data.pullRequestTitle = payload.pull_request.title;
  }

  return baseEvent;
}

function verifySignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(
    "sha256=" + hmac.update(payload).digest("hex"),
    "utf8",
  );
  const checksum = Buffer.from(signature, "utf8");

  if (
    checksum.length !== digest.length ||
    !crypto.timingSafeEqual(digest, checksum)
  ) {
    return false;
  }

  return true;
}

// Handle different webhook events
function handlePushEvent(payload: PushEventPayload): void {
  console.log(`Push event received for ${payload.repository.full_name}`);
  console.log(`Branch: ${payload.ref}`);
  console.log(`Commits: ${payload.commits.length}`);

  // Add your push event logic here
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let eventType: string | null = null;
  let payload: GitHubWebhookPayload | null = null;

  try {
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    const token = process.env.GITHUB_TOKEN;
    if (!webhookSecret) {
      console.error("GITHUB_WEBHOOK_SECRET environment variable is not set");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    const signature = request.headers.get("x-hub-signature-256");
    eventType = request.headers.get("x-github-event");
    const body = await request.text();

    // Parse payload early for error reporting
    try {
      payload = JSON.parse(body) as GitHubWebhookPayload;
    } catch (parseError) {
      // Create error event even if we can't parse payload
      const errorEvent: WebhookEvent = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        eventType: eventType ?? "unknown",
        isValid: false,
        repository: "unknown",
        sender: "unknown",
        data: {},
        error: "Invalid JSON payload",
      };
      webhookStore.addEvent(errorEvent);

      return NextResponse.json(
        { error: parseError, message: "Invalid JSON payload" },
        { status: 400 },
      );
    }

    // Validation checks
    if (!signature) {
      const errorEvent = createWebhookEvent(
        eventType ?? "unknown",
        payload,
        false,
        "No signature provided",
      );
      webhookStore.addEvent(errorEvent);

      return NextResponse.json(
        { error: "No signature provided" },
        { status: 401 },
      );
    }

    if (!eventType) {
      const errorEvent = createWebhookEvent(
        "unknown",
        payload,
        false,
        "No event type provided",
      );
      webhookStore.addEvent(errorEvent);

      return NextResponse.json(
        { error: "No event type provided" },
        { status: 400 },
      );
    }

    // Verify signature
    if (!verifySignature(body, signature, webhookSecret)) {
      const errorEvent = createWebhookEvent(
        eventType,
        payload,
        false,
        "Invalid signature - webhook not from GitHub",
      );
      webhookStore.addEvent(errorEvent);

      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Create successful event
    const successEvent = createWebhookEvent(eventType, payload, true);
    webhookStore.addEvent(successEvent);

    // Handle the event (your existing logic)
    switch (eventType) {
      case "push":
        handlePushEvent(payload as PushEventPayload);
        break;
      case "pull_request":
        handlePullRequestEvent(
          payload as PullRequestEventPayload,
          token as string,
        );
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
        break;
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error processing webhook:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Create error event if we have enough info
    if (payload && eventType) {
      const errorEvent = createWebhookEvent(
        eventType,
        payload,
        false,
        `Processing error: ${errorMessage}`,
      );
      webhookStore.addEvent(errorEvent);
    }

    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 },
    );
  }
}
