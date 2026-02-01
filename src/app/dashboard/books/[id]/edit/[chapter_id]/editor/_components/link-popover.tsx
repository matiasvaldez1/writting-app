"use client";

import { useState } from "react";
import { Link2Icon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import type { Editor } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LinkPopover({ editor }: { editor: Editor }) {
  const t = useTranslations("editor.toolbar");
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      const currentUrl = editor.getAttributes("link").href ?? "";
      setUrl(currentUrl);
    }
    setOpen(isOpen);
  };

  const applyLink = () => {
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    setOpen(false);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button
          title={t("insertLink")}
          className={cn(
            "p-1.5 rounded hover:bg-accent transition-colors",
            editor.isActive("link") && "bg-accent text-accent-foreground"
          )}
        >
          <Link2Icon className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" side="top">
        <div className="flex flex-col gap-2">
          <Input
            placeholder={t("linkUrl")}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyLink()}
            className="h-8 text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={applyLink} className="flex-1 h-7">
              {t("linkApply")}
            </Button>
            {editor.isActive("link") && (
              <Button
                size="sm"
                variant="destructive"
                onClick={removeLink}
                className="h-7"
              >
                {t("linkRemove")}
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
