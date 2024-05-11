"use client";

import { updateChapterTextContent } from "@/app/_actions/books";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState, useTransition } from "react";
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
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: "w-full h-[70svh]",
        spellcheck: "false",
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
    <div ref={editorRef} className="w-full flex flex-col gap-10">
      <MenuBar saving={saving} editor={editor} editorRef={editorRef} />
      <EditorContent content={content} editor={editor} className="p-4" />
    </div>
  );
}
