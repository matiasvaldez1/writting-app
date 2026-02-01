"use client";

import { useState, useTransition } from "react";
import { CheckIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { updateBookMetadataAction } from "@/app/_actions/books";
import { useToast } from "@/components/ui/use-toast";

export default function EditableBookFields({
  bookId,
  initialName,
  initialDescription,
}: {
  bookId: number;
  initialName: string;
  initialDescription: string;
}) {
  const t = useTranslations("editBook");
  const { toast } = useToast();
  const [, startTransition] = useTransition();
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const handleSaveName = () => {
    startTransition(async () => {
      try {
        await updateBookMetadataAction(bookId, { bookName: name });
        toast({ title: t("bookNameUpdated") });
      } catch {
        toast({ title: t("bookNameUpdateFailed") });
      }
    });
    setEditingName(false);
  };

  const handleSaveDescription = () => {
    startTransition(async () => {
      try {
        await updateBookMetadataAction(bookId, {
          bookDescription: description,
        });
        toast({ title: t("bookDescriptionUpdated") });
      } catch {
        toast({ title: t("bookDescriptionUpdateFailed") });
      }
    });
    setEditingDescription(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {editingName ? (
          <>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-2xl font-bold h-10"
            />
            <CheckIcon
              onClick={handleSaveName}
              className="w-6 h-6 cursor-pointer"
            />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">{name}</h1>
            <Pencil2Icon
              onClick={() => setEditingName(true)}
              className="cursor-pointer"
            />
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {editingDescription ? (
          <>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-8"
            />
            <CheckIcon
              onClick={handleSaveDescription}
              className="w-6 h-6 cursor-pointer"
            />
          </>
        ) : (
          <>
            <p className="text-muted-foreground">{description}</p>
            <Pencil2Icon
              onClick={() => setEditingDescription(true)}
              className="cursor-pointer flex-shrink-0"
            />
          </>
        )}
      </div>
    </div>
  );
}
