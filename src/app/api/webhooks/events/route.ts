import { NextRequest } from "next/server";
import { webhookStore } from "@/lib/webhooks/store";

export async function GET(request: NextRequest): Promise<Response> {
  // Create a readable stream for SSE
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial events
      const initialEvents = webhookStore.getEvents();
      const data = `data: ${JSON.stringify(initialEvents)}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Subscribe to new events
      const unsubscribe = webhookStore.subscribe((events) => {
        const data = `data: ${JSON.stringify(events)}\n\n`;
        controller.enqueue(encoder.encode(data));
      });

      // Clean up when client disconnects
      request.signal.addEventListener("abort", () => {
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}
