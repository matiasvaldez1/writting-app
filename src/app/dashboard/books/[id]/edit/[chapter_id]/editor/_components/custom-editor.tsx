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
import { useTranslations } from "next-intl";
import { HelpDialog } from "@/components/help-dialog";
import {
  addWritingSession,
  updateChapterTextContent,
} from "@/app/_actions/books";
import useWritingSession from "@/hooks/use-writing-session";
import EditorTopBar from "./editor-top-bar";
import BubbleMenuBar from "./bubble-menu-bar";
import FloatingMenuBar from "./floating-menu-bar";

export default function CustomTextEditor({
  content,
  chapterId,
  bookId,
}: {
  content: string;
  chapterId: number;
  bookId: number;
}) {
  const t = useTranslations("editor");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
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
        placeholder: t("startWriting"),
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
          "prose prose-lg dark:prose-invert leading-relaxed max-w-none [&_ol]:list-decimal [&_ul]:list-disc focus:outline-none min-h-[70vh]",
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

  return (
    <div
      ref={editorRef}
      className={`${isFullscreen ? "p-10 bg-background" : ""}`}
    >
      <EditorTopBar
        saving={saving}
        editor={editor}
        editorRef={editorRef}
        setIsFullscreen={setIsFullscreen}
        wordCount={wordCount}
        bookId={bookId}
        onHelpOpen={() => setHelpOpen(true)}
      />
      {editor && <BubbleMenuBar editor={editor} />}
      {editor && <FloatingMenuBar editor={editor} />}
      <div className="mx-auto max-w-[720px] px-6 py-12">
        <EditorContent onClick={startTracking} editor={editor} />
      </div>
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
