import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import anthropic from "@/lib/ai/client";
import {
  CONTINUE_WRITING_PROMPT,
  EXPAND_TEXT_PROMPT,
  SUMMARIZE_TEXT_PROMPT,
  CHAPTER_OUTLINE_PROMPT,
  TRANSLATE_PROMPT,
} from "@/lib/ai/prompts";

const PROMPT_MAP: Record<string, string> = {
  continue: CONTINUE_WRITING_PROMPT,
  expand: EXPAND_TEXT_PROMPT,
  summarize: SUMMARIZE_TEXT_PROMPT,
  outline: CHAPTER_OUTLINE_PROMPT,
  translate: TRANSLATE_PROMPT,
};

const MODEL_MAP: Record<string, string> = {
  continue: "claude-sonnet-4-20250514",
  expand: "claude-sonnet-4-20250514",
  summarize: "claude-haiku-4-20250414",
  outline: "claude-sonnet-4-20250514",
  translate: "claude-haiku-4-20250414",
};

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { text, type, context } = await req.json();
  if (!text || !type || !PROMPT_MAP[type]) {
    return new Response("Missing or invalid parameters", { status: 400 });
  }

  const systemPrompt = PROMPT_MAP[type];
  const model = MODEL_MAP[type];
  const userMessage = context ? `Context: ${context}\n\nText: ${text}` : text;

  const stream = await anthropic.messages.stream({
    model,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
