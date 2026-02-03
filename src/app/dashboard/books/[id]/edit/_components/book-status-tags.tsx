"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusSelect from "@/app/dashboard/books/_components/status-select";
import TagPicker, {
  type Tag,
} from "@/app/dashboard/books/_components/tag-picker";
import { TAG_COLORS } from "@/lib/tag-colors";
import {
  updateBookStatusAction,
  setBookTagsAction,
} from "@/app/_actions/books";
import { updateTagAction, deleteTagAction } from "@/app/_actions/tags";
import type { BookStatus } from "@/types/zodSchemas";

export default function BookStatusTags({
  bookId,
  initialStatus,
  initialBookTagIds,
  userTags: initialUserTags,
}: {
  bookId: number;
  initialStatus: BookStatus;
  initialBookTagIds: number[];
  userTags: Tag[];
}) {
  const tStatus = useTranslations("status");
  const tTags = useTranslations("tags");
  const { toast } = useToast();
  const [status, setStatus] = useState<BookStatus>(initialStatus);
  const [selectedTagIds, setSelectedTagIds] =
    useState<number[]>(initialBookTagIds);
  const [userTags, setUserTags] = useState<Tag[]>(initialUserTags);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleStatusChange = async (newStatus: BookStatus) => {
    setStatus(newStatus);
    await updateBookStatusAction(bookId, newStatus);
    toast({ title: tStatus("updated") });
  };

  const handleToggleTag = async (tagId: number) => {
    const next = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];
    setSelectedTagIds(next);
    await setBookTagsAction(bookId, next);
    toast({ title: tTags("updated") });
  };

  const handleEditTag = async () => {
    if (!editingTagId || !editName.trim()) return;
    const result = await updateTagAction({
      tagId: editingTagId,
      name: editName.trim(),
      color: editColor,
    });
    if (result.status === "success" && result.tag) {
      setUserTags((prev) =>
        prev.map((t) => (t.id === editingTagId ? result.tag! : t))
      );
      setEditingTagId(null);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    await deleteTagAction(tagId);
    setUserTags((prev) => prev.filter((t) => t.id !== tagId));
    setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">{tStatus("label")}</Label>
        <StatusSelect value={status} onValueChange={handleStatusChange} />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">{tTags("label")}</Label>
        <TagPicker
          tags={userTags}
          selectedTagIds={selectedTagIds}
          onToggle={handleToggleTag}
          onTagCreated={(tag) => setUserTags((prev) => [...prev, tag])}
        />
        {userTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {userTags.map((tag) => (
              <Popover
                key={tag.id}
                open={editingTagId === tag.id}
                onOpenChange={(open) => {
                  if (open) {
                    setEditingTagId(tag.id);
                    setEditName(tag.name);
                    setEditColor(tag.color);
                  } else {
                    setEditingTagId(null);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil1Icon className="h-3 w-3" />
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3" align="start">
                  <p className="text-sm font-medium mb-2">{tTags("edit")}</p>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mb-2 h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleEditTag();
                      }
                    }}
                  />
                  <div className="grid grid-cols-5 gap-1.5 mb-3">
                    {TAG_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditColor(c)}
                        className={`h-6 w-6 rounded-full transition-all ${
                          editColor === c
                            ? "ring-2 ring-offset-2 ring-primary"
                            : ""
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 h-7 text-xs"
                      disabled={!editName.trim()}
                      onClick={handleEditTag}
                    >
                      {tTags("save")}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 text-xs"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
