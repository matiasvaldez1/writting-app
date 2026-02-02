"use client";

import { FloatingMenu, type Editor } from "@tiptap/react";
import {
  ListBulletIcon,
  QuoteIcon,
  DividerHorizontalIcon,
  ImageIcon,
  PlusIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import ImageDialog from "./image-dialog";

function FloatingButton({
  onClick,
  isActive = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded hover:bg-accent transition-colors",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {children}
    </button>
  );
}

export default function FloatingMenuBar({
  editor,
  onAIContinue,
  isAIGenerating,
}: {
  editor: Editor;
  onAIContinue: () => void;
  isAIGenerating: boolean;
}) {
  const t = useTranslations("editor.toolbar");
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const iconSize = "h-4 w-4";

  useEffect(() => {
    if (!localStorage.getItem("hasUsedFloatingMenu")) {
      setShowPulse(true);
    }
  }, []);

  return (
    <>
      <FloatingMenu
        editor={editor}
        tippyOptions={{ duration: 150 }}
        className="flex items-center gap-0.5"
      >
        {!isExpanded ? (
          <button
            onClick={() => {
              setIsExpanded(true);
              if (showPulse) {
                localStorage.setItem("hasUsedFloatingMenu", "true");
                setShowPulse(false);
              }
            }}
            className={cn(
              "p-1 rounded-full border bg-background shadow-md hover:bg-accent transition-colors",
              showPulse && "animate-pulse"
            )}
            title={t("addBlock")}
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex items-center gap-0.5 rounded-lg border bg-background shadow-lg p-1.5 animate-in fade-in-0 zoom-in-95">
            <FloatingButton
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                setIsExpanded(false);
              }}
              isActive={editor.isActive("heading", { level: 1 })}
              title={t("heading1")}
            >
              <span className="text-xs font-bold">H1</span>
            </FloatingButton>
            <FloatingButton
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                setIsExpanded(false);
              }}
              isActive={editor.isActive("heading", { level: 2 })}
              title={t("heading2")}
            >
              <span className="text-xs font-bold">H2</span>
            </FloatingButton>
            <FloatingButton
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                setIsExpanded(false);
              }}
              isActive={editor.isActive("heading", { level: 3 })}
              title={t("heading3")}
            >
              <span className="text-xs font-bold">H3</span>
            </FloatingButton>
            <FloatingButton
              onClick={() => {
                editor.chain().focus().toggleBulletList().run();
                setIsExpanded(false);
              }}
              isActive={editor.isActive("bulletList")}
              title={t("bulletList")}
            >
              <ListBulletIcon className={iconSize} />
            </FloatingButton>
            <FloatingButton
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run();
                setIsExpanded(false);
              }}
              isActive={editor.isActive("orderedList")}
              title={t("orderedList")}
            >
              <span className="text-xs font-bold">1.</span>
            </FloatingButton>
            <FloatingButton
              onClick={() => {
                editor.chain().focus().toggleBlockquote().run();
                setIsExpanded(false);
              }}
              isActive={editor.isActive("blockquote")}
              title={t("blockquote")}
            >
              <QuoteIcon className={iconSize} />
            </FloatingButton>
            <FloatingButton
              onClick={() => {
                editor.chain().focus().toggleCodeBlock().run();
                setIsExpanded(false);
              }}
              isActive={editor.isActive("codeBlock")}
              title={t("codeBlock")}
            >
              <span className="text-xs font-mono">{"{}"}</span>
            </FloatingButton>
            <FloatingButton
              onClick={() => {
                setImageDialogOpen(true);
                setIsExpanded(false);
              }}
              title={t("insertImage")}
            >
              <ImageIcon className={iconSize} />
            </FloatingButton>
            <FloatingButton
              onClick={() => {
                editor.chain().focus().setHorizontalRule().run();
                setIsExpanded(false);
              }}
              title={t("horizontalRule")}
            >
              <DividerHorizontalIcon className={iconSize} />
            </FloatingButton>
            <FloatingButton
              onClick={() => {
                onAIContinue();
                setIsExpanded(false);
              }}
              title={t("aiContinue")}
            >
              {isAIGenerating ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent inline-block" />
              ) : (
                <MagicWandIcon className={iconSize} />
              )}
            </FloatingButton>
          </div>
        )}
      </FloatingMenu>
      <ImageDialog
        editor={editor}
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
      />
    </>
  );
}
