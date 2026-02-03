"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TAG_COLORS } from "@/lib/tag-colors";
import { createTagAction } from "@/app/_actions/tags";

export type Tag = {
  id: number;
  name: string;
  color: string;
};

export default function TagPicker({
  tags,
  selectedTagIds,
  onToggle,
  onTagCreated,
}: {
  tags: Tag[];
  selectedTagIds: number[];
  onToggle: (tagId: number) => void;
  onTagCreated?: (tag: Tag) => void;
}) {
  const t = useTranslations("tags");
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<string>(TAG_COLORS[0]);
  const [creating, setCreating] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const result = await createTagAction({
      name: newName.trim(),
      color: newColor,
    });
    if (result.status === "success" && result.tag) {
      onTagCreated?.(result.tag);
      setNewName("");
      setNewColor(TAG_COLORS[0]);
      setPopoverOpen(false);
    }
    setCreating(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => {
        const selected = selectedTagIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onToggle(tag.id)}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border ${
              selected
                ? "border-transparent text-white"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
            style={selected ? { backgroundColor: tag.color } : undefined}
          >
            {!selected && (
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: tag.color }}
              />
            )}
            {tag.name}
          </button>
        );
      })}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <p className="text-sm font-medium mb-2">{t("create")}</p>
          <Input
            placeholder={t("name")}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mb-2 h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {TAG_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className={`h-6 w-6 rounded-full transition-all ${
                  newColor === c ? "ring-2 ring-offset-2 ring-primary" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <Button
            size="sm"
            className="w-full h-7 text-xs"
            disabled={!newName.trim() || creating}
            onClick={handleCreate}
          >
            {t("save")}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
