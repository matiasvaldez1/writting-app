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
import Focus from "@tiptap/extension-focus";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { HelpDialog } from "@/components/help-dialog";
import {
  addWritingSession,
  recordWordCountAction,
  updateChapterTextContent,
} from "@/app/_actions/books";
import {
  saveDraftLocally,
  loadLocalDraft,
  markDraftSynced,
} from "@/lib/offline/draft-manager";
import useOnlineStatus from "@/hooks/use-online-status";
import useSyncQueue from "@/hooks/use-sync-queue";
import useWritingSession from "@/hooks/use-writing-session";
import useAIContinue from "@/hooks/use-ai-continue";
import { PageBreaks } from "./page-break-extension";
import EditorTopBar from "./editor-top-bar";
import BubbleMenuBar from "./bubble-menu-bar";
import FloatingMenuBar from "./floating-menu-bar";

export type SaveStatus = "synced" | "saving" | "local" | "failed";
export type ChapterInfo = {
  id: number;
  chapterNumber: number;
  chapterTitle: string;
};

export default function CustomTextEditor({
  content,
  chapterId,
  bookId,
  chapterTitle,
  prevChapterId,
  nextChapterId,
  allChapters,
}: {
  content: string;
  chapterId: number;
  bookId: number;
  chapterTitle: string;
  prevChapterId: number | null;
  nextChapterId: number | null;
  allChapters: ChapterInfo[];
}) {
  const t = useTranslations("editor");
  const [helpOpen, setHelpOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const { startTracking } = useWritingSession(async (duration) => {
    await addWritingSession(duration, bookId, chapterId);
  });
  useOnlineStatus();
  useSyncQueue();
  const { generate: aiGenerate, isGenerating } = useAIContinue();
  const isAIGeneratingRef = useRef(false);
  const prevGeneratingRef = useRef(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWordCountRef = useRef<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("synced");
  const [, startTransition] = useTransition();
  const editorInstanceRef = useRef<ReturnType<typeof useEditor>>(null);

  const saveNow = useCallback(async () => {
    const ed = editorInstanceRef.current;
    if (!ed || ed.isDestroyed) return;
    const html = ed.getHTML();

    setSaveStatus("saving");

    await saveDraftLocally(bookId, chapterId, html);

    if (!navigator.onLine) {
      setSaveStatus("local");
      return;
    }

    try {
      await updateChapterTextContent(bookId, chapterId, html);
      await markDraftSynced(bookId, chapterId);
      setSaveStatus("synced");

      const currentWords = ed.storage.characterCount?.words() ?? 0;
      if (lastWordCountRef.current !== null) {
        const delta = currentWords - lastWordCountRef.current;
        if (delta > 0) {
          recordWordCountAction(delta);
        }
      }
      lastWordCountRef.current = currentWords;
    } catch {
      setSaveStatus("local");
    }
  }, [bookId, chapterId]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Typography,
      Underline,
      CharacterCount,
      Placeholder.configure({
        showOnlyWhenEditable: true,
        placeholder: ({ node, editor: e }) => {
          if (
            e.state.doc.textContent.length === 0 &&
            node.type.name === "paragraph"
          ) {
            return t("placeholderEmpty");
          }
          return "";
        },
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
      Focus.configure({
        className: "has-focus",
        mode: "deepest",
      }),
      PageBreaks,
    ],
    content,
    editorProps: {
      attributes: {
        spellcheck: "true",
        class:
          "prose prose-lg dark:prose-invert leading-relaxed max-w-none [&_ol]:list-decimal [&_ul]:list-disc focus:outline-none min-h-[70vh]",
      },
    },
    onUpdate: () => {
      if (isAIGeneratingRef.current) return;
      startTransition(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          saveNow();
        }, 2000);
      });
    },
  });

  useEffect(() => {
    editorInstanceRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    let cancelled = false;
    loadLocalDraft(bookId, chapterId).then((draft) => {
      if (cancelled || !draft || draft.synced === 1) return;
      if (draft.content && draft.content !== editor.getHTML()) {
        editor.commands.setContent(draft.content);
        setSaveStatus("local");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [editor, bookId, chapterId]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const t = setTimeout(() => {
      editor.commands.focus("end");
    }, 100);
    return () => clearTimeout(t);
  }, [editor]);

  useEffect(() => {
    isAIGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  useEffect(() => {
    if (prevGeneratingRef.current && !isGenerating) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      saveNow();
    }
    prevGeneratingRef.current = isGenerating;
  }, [isGenerating, saveNow]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        saveNow();
      }
      if (e.key === "Escape") {
        setFocusMode(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === " ") {
        e.preventDefault();
        const ed = editorInstanceRef.current;
        if (ed && !ed.isDestroyed && !isAIGeneratingRef.current) {
          aiGenerate(ed, chapterTitle);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveNow, aiGenerate, chapterTitle]);

  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    setPageCount(editor.storage.pageBreaks?.pageCount ?? 1);
    const handler = () => {
      setPageCount(editor.storage.pageBreaks?.pageCount ?? 1);
    };
    editor.on("transaction", handler);
    return () => {
      editor.off("transaction", handler);
    };
  }, [editor]);

  const wordCount = editor?.storage.characterCount.words() ?? 0;
  const textContent = editor?.state.doc.textContent ?? "";

  return (
    <div
      ref={editorRef}
      className={cn("bg-background min-h-svh", focusMode && "focus-mode")}
    >
      <EditorTopBar
        saveStatus={saveStatus}
        onRetry={saveNow}
        editor={editor}
        editorRef={editorRef}
        wordCount={wordCount}
        pageCount={pageCount}
        bookId={bookId}
        chapterTitle={chapterTitle}
        onHelpOpen={() => setHelpOpen(true)}
        prevChapterId={prevChapterId}
        nextChapterId={nextChapterId}
        textContent={textContent}
        isAIGenerating={isGenerating}
        allChapters={allChapters}
        currentChapterId={chapterId}
        focusMode={focusMode}
        onToggleFocusMode={() => setFocusMode((prev) => !prev)}
      />
      {editor && <BubbleMenuBar editor={editor} />}
      {editor && (
        <FloatingMenuBar
          editor={editor}
          onAIContinue={() => aiGenerate(editor, chapterTitle)}
          isAIGenerating={isGenerating}
        />
      )}
      <div
        className="mx-auto max-w-4xl px-6 sm:px-12 py-12 min-h-[calc(100vh-60px)] border-x border-border/20 cursor-text"
        onClick={(e) => {
          if (e.target === e.currentTarget && editor) {
            editor.commands.focus("end");
          }
          startTracking();
        }}
      >
        <EditorContent onClick={startTracking} editor={editor} />
      </div>
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
