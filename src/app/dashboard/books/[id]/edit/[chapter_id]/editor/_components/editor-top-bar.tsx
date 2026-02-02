"use client";

import {
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  ResetIcon,
  QuestionMarkCircledIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckIcon,
  SunIcon,
  MoonIcon,
} from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import screenfull from "screenfull";
import { useTranslations } from "next-intl";
import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import useOnlineStatus from "@/hooks/use-online-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SaveStatus, ChapterInfo } from "./custom-editor";
import ReadabilityPanel from "./readability-panel";

interface EditorTopBarProps {
  editor: Editor | null;
  editorRef: React.RefObject<HTMLDivElement>;
  saveStatus: SaveStatus;
  onRetry: () => void;
  wordCount: number;
  pageCount: number;
  bookId: number;
  chapterTitle: string;
  onHelpOpen: () => void;
  prevChapterId: number | null;
  nextChapterId: number | null;
  textContent: string;
  isAIGenerating: boolean;
  allChapters: ChapterInfo[];
  currentChapterId: number;
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
        "p-2 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
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
  saveStatus,
  onRetry,
  wordCount,
  pageCount,
  bookId,
  chapterTitle,
  onHelpOpen,
  prevChapterId,
  nextChapterId,
  textContent,
  isAIGenerating,
  allChapters,
  currentChapterId,
}: EditorTopBarProps) {
  const t = useTranslations("editor");
  const tt = useTranslations("editor.toolbar");
  const tTheme = useTranslations("theme");
  const router = useRouter();
  const { setTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const [isFullscreenState, setIsFullscreenState] = useState(false);

  useEffect(() => {
    if (!screenfull.isEnabled) return;
    const handler = () => {
      setIsFullscreenState(screenfull.isFullscreen);
    };
    screenfull.on("change", handler);
    return () => {
      screenfull.off("change", handler);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!screenfull.isEnabled) return;
    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      screenfull.request(editorRef.current!);
    }
  }, [editorRef]);

  if (!editor) return null;

  const iconSize = "h-5 w-5";

  return (
    <div className="sticky top-0 z-10 flex items-center gap-1 bg-background border-b border-border/40 px-3 py-2 overflow-x-auto overflow-y-hidden opacity-40 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
      <TopBarButton
        onClick={() => router.push(`/dashboard/books/${bookId}/edit`)}
        title={tt("back")}
      >
        <ArrowLeftIcon className={iconSize} />
      </TopBarButton>

      <TopBarButton
        onClick={() =>
          router.push(`/dashboard/books/${bookId}/edit/${prevChapterId}/editor`)
        }
        disabled={prevChapterId === null}
        title={tt("prevChapter")}
      >
        <ChevronLeftIcon className={iconSize} />
      </TopBarButton>
      <TopBarButton
        onClick={() =>
          router.push(`/dashboard/books/${bookId}/edit/${nextChapterId}/editor`)
        }
        disabled={nextChapterId === null}
        title={tt("nextChapter")}
      >
        <ChevronRightIcon className={iconSize} />
      </TopBarButton>

      <div className="hidden sm:block w-px h-6 bg-border/40 mx-1" />

      <span className="hidden sm:flex items-center gap-0">
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
      </span>

      <div className="hidden sm:block w-px h-6 bg-border/40 mx-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors truncate max-w-[200px] sm:max-w-[300px]">
            <span className="truncate">{chapterTitle}</span>
            <ChevronDownIcon className="h-3.5 w-3.5 shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
          {allChapters.map((ch) => (
            <DropdownMenuItem
              key={ch.id}
              onClick={() =>
                router.push(`/dashboard/books/${bookId}/edit/${ch.id}/editor`)
              }
              className={cn(ch.id === currentChapterId && "font-bold")}
            >
              <span className="truncate">
                Ch. {ch.chapterNumber}: {ch.chapterTitle}
              </span>
              {ch.id === currentChapterId && (
                <CheckIcon className="ml-auto h-4 w-4 shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        {!isOnline && (
          <span className="rounded bg-amber-500 px-1.5 py-0.5 text-xs font-medium text-white">
            {t("offline")}
          </span>
        )}
        {isAIGenerating && (
          <div className="flex items-center gap-1.5 text-sm text-purple-400">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse inline-block" />
            <span>{t("aiGenerating")}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {saveStatus === "failed" ? (
            <>
              <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
              <span>{t("saveFailed")}</span>
              <button
                onClick={onRetry}
                className="ml-1 text-xs underline hover:text-foreground transition-colors"
              >
                {t("retry")}
              </button>
            </>
          ) : saveStatus === "saving" ? (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse inline-block" />
              <span>{t("saving")}</span>
            </>
          ) : saveStatus === "local" ? (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
              <span>{t("savedLocally")}</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
              <span>{t("saved")}</span>
            </>
          )}
        </div>

        <span className="hidden sm:inline text-sm text-muted-foreground">
          {t("words", { count: wordCount })} /{" "}
          {t("pages", { count: pageCount })}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              title={tTheme("toggle")}
              className="relative p-2 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <SunIcon
                className={cn(
                  iconSize,
                  "rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                )}
              />
              <MoonIcon
                className={cn(
                  iconSize,
                  "absolute top-2 left-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                )}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              {tTheme("light")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              {tTheme("dark")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ReadabilityPanel text={textContent} />

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
