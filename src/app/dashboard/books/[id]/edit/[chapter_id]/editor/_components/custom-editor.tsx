"use client";

import {
  addUserWrittingSession,
  updateChapterTextContent,
} from "@/app/_actions/books";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState, useTransition } from "react";
import MenuBar from "./menu-bar";
import React from "react";
import useWritingSession from "@/hooks/use-writting-session";

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
    console.log("Saved writting session ⌛");
    await addUserWrittingSession(duration, bookId, chapterId);
  });
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        spellcheck: "false",
        class: "prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc",
      },
    },
    onUpdate: ({ editor }) => {
      startTransition(() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(async () => {
          setIsSaving(true);
          try {
            await updateChapterTextContent(
              bookId,
              chapterId,
              editor?.getHTML() ?? ""
            );
          } catch (error) {
            console.error("error", error);
          } finally {
            setIsSaving(false);
          }
        }, 2000);
      });
    },
  });
  const editorRef = useRef(null);

  const timeoutRef = useRef<any>(null);
  const [saving, setIsSaving] = useState(false);
  const [, startTransition] = useTransition();

  return (
    <div ref={editorRef} className={`${isFullscreen ? "p-10 bg-white" : ""}`}>
      <MenuBar
        saving={saving}
        editor={editor}
        editorRef={editorRef}
        setIsFullscreen={setIsFullscreen}
      />
      <EditorContent
        onClick={startTracking}
        content={content}
        editor={editor}
      />
    </div>
  );
}
