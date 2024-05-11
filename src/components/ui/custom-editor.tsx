"use client";

import { updateChapterTextContent } from "@/app/_actions/books";
import {
  CheckIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
} from "@radix-ui/react-icons";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState, useTransition } from "react";
import screenfull from "screenfull";
import { LoadingSpinner } from "./loading";

const MenuBar = ({
  editor,
  editorRef,
  saving,
}: {
  editor: any;
  editorRef: any;
  saving: boolean;
}) => {
  const [showIcon, setShowIcon] = useState(false);

  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.request(editorRef.current);
    }
    if (screenfull.isFullscreen) {
      screenfull.exit();
    }
  };

  screenfull.onchange((e) => {
    setShowIcon(screenfull.isFullscreen);
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-8">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <button onClick={() => editor.chain().focus().undo().run()}>undo</button>
      <button onClick={() => editor.chain().focus().redo().run()}>redo</button>
      <div className="flex flex-col justify-center align-middle">
        {saving ? (
          <LoadingSpinner className="h-6 w-8" />
        ) : (
          <CheckIcon className="h-6 w-8" />
        )}
      </div>
      <button onClick={toggleFullscreen}>
        {showIcon ? (
          <ExitFullScreenIcon className="h-6 w-8" />
        ) : (
          <EnterFullScreenIcon className="h-6 w-8" />
        )}
      </button>
    </div>
  );
};

const CustomTextEditor = ({
  content,
  chapterId,
  bookId,
}: {
  content: string;
  chapterId: number;
  bookId: number;
}) => {
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
  const [isPending, startTransition] = useTransition();

  return (
    <div ref={editorRef} className="w-full">
      <MenuBar saving={saving} editor={editor} editorRef={editorRef} />
      <EditorContent content={content} editor={editor} />
    </div>
  );
};

export default CustomTextEditor;
