"use client";

import { BubbleMenu, type Editor } from "@tiptap/react";
import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  CodeIcon,
  UnderlineIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import LinkPopover from "./link-popover";
import ColorPicker from "./color-picker";

function BubbleButton({
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

export default function BubbleMenuBar({ editor }: { editor: Editor }) {
  const t = useTranslations("editor.toolbar");
  const iconSize = "h-4 w-4";

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 150 }}
      className="flex items-center gap-0.5 rounded-lg border bg-background shadow-lg p-1.5 animate-in fade-in-0 zoom-in-95"
    >
      <BubbleButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title={t("bold")}
      >
        <FontBoldIcon className={iconSize} />
      </BubbleButton>
      <BubbleButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title={t("italic")}
      >
        <FontItalicIcon className={iconSize} />
      </BubbleButton>
      <BubbleButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title={t("underline")}
      >
        <UnderlineIcon className={iconSize} />
      </BubbleButton>
      <BubbleButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title={t("strikethrough")}
      >
        <StrikethroughIcon className={iconSize} />
      </BubbleButton>
      <BubbleButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title={t("inlineCode")}
      >
        <CodeIcon className={iconSize} />
      </BubbleButton>

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      <LinkPopover editor={editor} />
      <ColorPicker editor={editor} />

      <Separator orientation="vertical" className="mx-0.5 h-5" />

      <BubbleButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title={t("alignLeft")}
      >
        <TextAlignLeftIcon className={iconSize} />
      </BubbleButton>
      <BubbleButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title={t("alignCenter")}
      >
        <TextAlignCenterIcon className={iconSize} />
      </BubbleButton>
      <BubbleButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title={t("alignRight")}
      >
        <TextAlignRightIcon className={iconSize} />
      </BubbleButton>
      <BubbleButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
        title={t("justify")}
      >
        <TextAlignJustifyIcon className={iconSize} />
      </BubbleButton>
    </BubbleMenu>
  );
}
