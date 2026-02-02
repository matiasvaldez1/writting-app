import { useState, useCallback, useRef } from "react";
import type { Editor } from "@tiptap/react";

export default function useAIContinue() {
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (editor: Editor, chapterTitle: string) => {
    if (!editor || editor.isDestroyed) return;

    const { from } = editor.state.selection;
    const textBefore = editor.state.doc.textBetween(0, from, "\n");
    const context = textBefore.slice(-2000);

    if (!context.trim()) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: context,
          type: "continue",
          context: chapterTitle,
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("AI request failed");

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          editor.commands.insertContent(chunk);
        }
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { generate, isGenerating, cancel };
}
