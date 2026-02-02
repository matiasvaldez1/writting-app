import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import anthropic from "@/lib/ai/client";
import { WRITING_ASSISTANT_PROMPT } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { text } = await req.json();
  if (!text || typeof text !== "string") {
    return new Response("Missing text", { status: 400 });
  }

  const stream = await anthropic.messages.stream({
    model: "claude-haiku-4-20250414",
    max_tokens: 1024,
    system: WRITING_ASSISTANT_PROMPT,
    messages: [{ role: "user", content: text }],
  });

  return new Response(stream.toReadableStream(), {
    headers: { "Content-Type": "text/event-stream" },
  });
}
