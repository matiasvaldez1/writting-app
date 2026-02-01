"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Typography from "@tiptap/extension-typography";
import CharacterCount from "@tiptap/extension-character-count";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { useRef, useState, useTransition } from "react";
import {
  addWritingSession,
  updateChapterTextContent,
} from "@/app/_actions/books";
import useWritingSession from "@/hooks/use-writing-session";
import MenuBar from "./menu-bar";

export default function CustomTextEditor({
  content,
  chapterId,
  bookId,
}: {
  content: string;
  chapterId: number;
  bookId: number;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { startTracking } = useWritingSession(async (duration) => {
    await addWritingSession(duration, bookId, chapterId);
  });
  const editorRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saving, setIsSaving] = useState(false);
  const [, startTransition] = useTransition();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Typography,
      Underline,
      CharacterCount,
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        spellcheck: "true",
        class:
          "prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      startTransition(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(async () => {
          setIsSaving(true);
          try {
            await updateChapterTextContent(
              bookId,
              chapterId,
              editor?.getHTML() ?? ""
            );
          } catch {
            // auto-save failed silently, will retry on next change
          } finally {
            setIsSaving(false);
          }
        }, 2000);
      });
    },
  });

  const wordCount = editor?.storage.characterCount.words() ?? 0;
  const charCount = editor?.storage.characterCount.characters() ?? 0;

  return (
    <div
      ref={editorRef}
      className={`${isFullscreen ? "p-10 bg-background" : ""}`}
    >
      <MenuBar
        saving={saving}
        editor={editor}
        editorRef={editorRef}
        setIsFullscreen={setIsFullscreen}
      />
      <EditorContent onClick={startTracking} editor={editor} />
      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
}
