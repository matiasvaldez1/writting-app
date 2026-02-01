"use client";

import {
  CheckIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  CodeIcon,
  ListBulletIcon,
  QuoteIcon,
  DividerHorizontalIcon,
  ResetIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  Link2Icon,
  ImageIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import screenfull from "screenfull";
import type { Editor } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MenuBarProps {
  editor: Editor | null;
  editorRef: React.RefObject<HTMLDivElement>;
  saving: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
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
        isActive && "bg-accent text-accent-foreground",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

export default function MenuBar({
  editor,
  editorRef,
  saving,
  setIsFullscreen,
}: MenuBarProps) {
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

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const iconSize = "h-4 w-4";

  return (
    <div className="flex flex-wrap items-center gap-0.5 border rounded-lg p-2 mb-4 bg-background">
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold (Ctrl+B)"
      >
        <FontBoldIcon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic (Ctrl+I)"
      >
        <FontItalicIcon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Strikethrough (Ctrl+Shift+S)"
      >
        <StrikethroughIcon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="Inline code (Ctrl+E)"
      >
        <CodeIcon className={iconSize} />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <span className="text-xs font-bold">H1</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <span className="text-xs font-bold">H2</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <span className="text-xs font-bold">H3</span>
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Text alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="Align left"
      >
        <TextAlignLeftIcon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="Align center"
      >
        <TextAlignCenterIcon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="Align right"
      >
        <TextAlignRightIcon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
        title="Justify"
      >
        <TextAlignJustifyIcon className={iconSize} />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists & blocks */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <ListBulletIcon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Ordered list"
      >
        <span className="text-xs font-bold">1.</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <QuoteIcon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        title="Code block"
      >
        <span className="text-xs font-mono">{"{}"}</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal rule"
      >
        <DividerHorizontalIcon className={iconSize} />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Links & images */}
      <ToolbarButton
        onClick={setLink}
        isActive={editor.isActive("link")}
        title="Insert link"
      >
        <Link2Icon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={addImage} title="Insert image">
        <ImageIcon className={iconSize} />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Color picker */}
      <input
        type="color"
        onInput={(e) =>
          editor
            .chain()
            .focus()
            .setColor((e.target as HTMLInputElement).value)
            .run()
        }
        value={editor.getAttributes("textStyle").color || "#000000"}
        title="Text color"
        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
      />

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Undo/redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <ResetIcon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Shift+Z)"
      >
        <ResetIcon className={cn(iconSize, "-scale-x-100")} />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Save status */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
        {saving ? (
          <>
            <span className="animate-pulse">Saving...</span>
          </>
        ) : (
          <>
            <CheckIcon className="h-3.5 w-3.5" />
            <span>Saved</span>
          </>
        )}
      </div>

      {/* Fullscreen */}
      <ToolbarButton onClick={toggleFullscreen} title="Toggle fullscreen">
        {isFullscreenState ? (
          <ExitFullScreenIcon className={iconSize} />
        ) : (
          <EnterFullScreenIcon className={iconSize} />
        )}
      </ToolbarButton>
    </div>
  );
}
