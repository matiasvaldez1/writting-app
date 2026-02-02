import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import anthropic from "@/lib/ai/client";
import { SEMANTIC_SEARCH_PROMPT } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { query, chapters } = await req.json();
  if (!query || !chapters || !Array.isArray(chapters)) {
    return new Response("Missing parameters", { status: 400 });
  }

  const chaptersText = chapters
    .map(
      (ch: { id: number; title: string; text: string }) =>
        `[Chapter ${ch.id}: ${ch.title}]\n${ch.text}`
    )
    .join("\n\n---\n\n");

  const totalChars = chaptersText.length;
  if (totalChars > 150000) {
    return NextResponse.json(
      {
        error:
          "Content too large for search. Try searching within fewer chapters.",
      },
      { status: 400 }
    );
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: SEMANTIC_SEARCH_PROMPT,
    messages: [
      {
        role: "user",
        content: `Search query: "${query}"\n\nBook content:\n${chaptersText}`,
      },
    ],
  });

  const content = response.content[0];
  const text = content.type === "text" ? content.text : "";

  return NextResponse.json({ results: text });
}
