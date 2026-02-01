"use client";

import {
  CheckIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  ResetIcon,
  QuestionMarkCircledIcon,
  ArrowLeftIcon,
} from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import screenfull from "screenfull";
import { useTranslations } from "next-intl";
import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";

interface EditorTopBarProps {
  editor: Editor | null;
  editorRef: React.RefObject<HTMLDivElement>;
  saving: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  wordCount: number;
  bookId: number;
  onHelpOpen: () => void;
}

function TopBarButton({
  onClick,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded hover:bg-accent transition-colors",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

export default function EditorTopBar({
  editor,
  editorRef,
  saving,
  setIsFullscreen,
  wordCount,
  bookId,
  onHelpOpen,
}: EditorTopBarProps) {
  const t = useTranslations("editor");
  const tt = useTranslations("editor.toolbar");
  const router = useRouter();
  const [isFullscreenState, setIsFullscreenState] = useState(false);

  useEffect(() => {
    if (!screenfull.isEnabled) return;
    const handler = () => {
      setIsFullscreenState(screenfull.isFullscreen);
      setIsFullscreen(screenfull.isFullscreen);
    };
    screenfull.on("change", handler);
    return () => {
      screenfull.off("change", handler);
    };
  }, [setIsFullscreen]);

  const toggleFullscreen = useCallback(() => {
    if (!screenfull.isEnabled) return;
    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      screenfull.request(editorRef.current!);
    }
  }, [editorRef]);

  if (!editor) return null;

  const iconSize = "h-4 w-4";

  return (
    <div className="sticky top-0 z-10 flex items-center gap-1 border-b backdrop-blur-sm bg-background/80 px-3 py-2 mb-4">
      <TopBarButton
        onClick={() => router.push(`/dashboard/books/${bookId}/edit`)}
        title={tt("back")}
      >
        <ArrowLeftIcon className={iconSize} />
      </TopBarButton>

      <div className="w-px h-5 bg-border mx-1" />

      <TopBarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title={tt("undo")}
      >
        <ResetIcon className={iconSize} />
      </TopBarButton>
      <TopBarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title={tt("redo")}
      >
        <ResetIcon className={cn(iconSize, "-scale-x-100")} />
      </TopBarButton>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {saving ? (
            <span className="animate-pulse">{t("saving")}</span>
          ) : (
            <>
              <CheckIcon className="h-3.5 w-3.5" />
              <span>{t("saved")}</span>
            </>
          )}
        </div>

        <span className="text-xs text-muted-foreground">
          {t("words", { count: wordCount })}
        </span>

        <TopBarButton onClick={onHelpOpen} title="Help">
          <QuestionMarkCircledIcon className={iconSize} />
        </TopBarButton>

        <TopBarButton onClick={toggleFullscreen} title={tt("fullscreen")}>
          {isFullscreenState ? (
            <ExitFullScreenIcon className={iconSize} />
          ) : (
            <EnterFullScreenIcon className={iconSize} />
          )}
        </TopBarButton>
      </div>
    </div>
  );
}
