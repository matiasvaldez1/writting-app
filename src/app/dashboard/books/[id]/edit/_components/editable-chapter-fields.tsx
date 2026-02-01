"use client";

import React, { useState, useTransition } from "react";
import { CheckIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import {
  updateChapterDescription,
  updateChapterTitle,
} from "@/app/_actions/books";
import { useToast } from "@/components/ui/use-toast";

function EditableChaptersFields({
  chapter,
  bookId,
}: {
  chapter: {
    id: number;
    chapterTitle: string;
    chapterNumber: number;
    chapterDescription: string;
  };
  bookId: number;
}) {
  const { toast } = useToast();
  const [, startTransition] = useTransition();
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [title, setTitle] = useState(chapter.chapterTitle);
  const [description, setDescription] = useState(chapter.chapterDescription);

  const handleSaveNewTitle = () => {
    startTransition(async () => {
      try {
        await updateChapterTitle(bookId, Number(chapter.id), title);
        toast({ title: "Chapter title updated" });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "";
        toast({ title: "Chapter title not updated", description: message });
      }
    });
    setEditingTitle(false);
  };

  const handleSaveNewDescription = () => {
    startTransition(async () => {
      try {
        await updateChapterDescription(bookId, Number(chapter.id), description);
        toast({ title: "Chapter description updated" });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "";
        toast({
          title: "Chapter description not updated",
          description: message,
        });
      }
    });
    setEditingDescription(false);
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="flex flex-col justify-evenly"
    >
      <div className="flex gap-1">
        {editingTitle ? (
          <>
            <Input
              className="h-6"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <CheckIcon
              onClick={handleSaveNewTitle}
              className="my-auto w-6 h-6 cursor-pointer"
            />
          </>
        ) : (
          <>
            <h2>{title}</h2>
            <Pencil2Icon
              onClick={() => setEditingTitle(true)}
              className="my-[auto] cursor-pointer"
            />
          </>
        )}
      </div>
      <div className="flex gap-1">
        {editingDescription ? (
          <>
            <Input
              className="h-6"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <CheckIcon
              onClick={handleSaveNewDescription}
              className="my-auto w-6 h-6 cursor-pointer"
            />
          </>
        ) : (
          <>
            <h2>{description}</h2>
            <Pencil2Icon
              onClick={() => setEditingDescription(true)}
              className="my-[auto] cursor-pointer"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default EditableChaptersFields;
