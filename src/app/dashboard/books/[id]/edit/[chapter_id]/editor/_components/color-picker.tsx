"use client";

import { useTranslations } from "next-intl";
import type { Editor } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const COLORS = [
  "#000000",
  "#434343",
  "#666666",
  "#999999",
  "#E03131",
  "#C2255C",
  "#9C36B5",
  "#6741D9",
  "#3B5BDB",
  "#1971C2",
  "#0C8599",
  "#099268",
  "#2F9E44",
  "#66A80F",
  "#F08C00",
  "#E8590C",
];

export default function ColorPicker({ editor }: { editor: Editor }) {
  const t = useTranslations("editor.toolbar");
  const currentColor = editor.getAttributes("textStyle").color;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          title={t("textColor")}
          className="p-1.5 rounded hover:bg-accent transition-colors"
        >
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs font-bold leading-none">A</span>
            <div
              className="w-4 h-1 rounded-sm"
              style={{ backgroundColor: currentColor || "#000000" }}
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" side="top">
        <div className="grid grid-cols-8 gap-1">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => editor.chain().focus().setColor(color).run()}
              className={cn(
                "w-6 h-6 rounded border transition-transform hover:scale-110",
                currentColor === color && "ring-2 ring-primary ring-offset-1"
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground w-full text-center"
        >
          {t("colorReset")}
        </button>
      </PopoverContent>
    </Popover>
  );
}
