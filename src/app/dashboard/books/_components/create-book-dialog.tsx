"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBookAction } from "@/app/_actions/books";
import { useToast } from "@/components/ui/use-toast";
import { templates } from "@/lib/templates";
import { cn } from "@/lib/utils";
import type { BookStatus } from "@/types/zodSchemas";
import StatusSelect from "./status-select";
import TagPicker, { type Tag } from "./tag-picker";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("createBook");

  return (
    <Button type="submit" disabled={pending}>
      {pending ? t("saving") : t("save")}
    </Button>
  );
}

export default function CreateBookDialog({ userTags }: { userTags: Tag[] }) {
  const t = useTranslations("createBook");
  const tStatus = useTranslations("status");
  const tTags = useTranslations("tags");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [amountOfChaptersIsKnown, setAmountOfChaptersIsKnown] = useState(false);
  const [bookStatus, setBookStatus] = useState<BookStatus>("draft");
  const [tags, setTags] = useState<Tag[]>(userTags);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [state, action] = useFormState(createBookAction, {
    status: "",
  });

  useEffect(() => {
    setTags(userTags);
  }, [userTags]);

  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: t("bookCreated"),
      });
      setOpen(false);
      setSelectedTemplate(null);
      setBookStatus("draft");
      setSelectedTagIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const handleToggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen((prev) => !prev)} asChild>
        <Button variant="outline">{t("trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="my-5">{t("title")}</DialogTitle>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-3">
              {t("chooseTemplate")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() =>
                    setSelectedTemplate(
                      selectedTemplate === tmpl.id ? null : tmpl.id
                    )
                  }
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-colors",
                    selectedTemplate === tmpl.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <span className="text-xl">{tmpl.icon}</span>
                  <span className="text-sm font-medium">
                    {t(tmpl.labelKey)}
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    {t(tmpl.descriptionKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <form action={action} className="flex flex-col gap-6">
            {selectedTemplate && (
              <input type="hidden" name="templateId" value={selectedTemplate} />
            )}
            <Label htmlFor="bookName" className="text-base">
              {t("bookName")}
            </Label>
            <Input id="bookName" name="bookName" type="text" />
            {state?.bookName && (
              <span className="text-destructive">{state.bookName}</span>
            )}
            <Label htmlFor="bookDescription" className="text-base">
              {t("bookDescription")}
            </Label>
            <Input id="bookDescription" name="bookDescription" type="text" />
            {state?.bookDescription && (
              <span className="text-destructive">{state.bookDescription}</span>
            )}
            <div className="space-y-2">
              <Label className="text-base">{tStatus("label")}</Label>
              <StatusSelect value={bookStatus} onValueChange={setBookStatus} />
              <input type="hidden" name="status" value={bookStatus} />
            </div>
            <div className="space-y-2">
              <Label className="text-base">{tTags("label")}</Label>
              <TagPicker
                tags={tags}
                selectedTagIds={selectedTagIds}
                onToggle={handleToggleTag}
                onTagCreated={(tag) => setTags((prev) => [...prev, tag])}
              />
              <input
                type="hidden"
                name="tagIds"
                value={JSON.stringify(selectedTagIds)}
              />
            </div>
            {!selectedTemplate && (
              <>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="amountOfChaptersIsKnown"
                    name="amountOfChaptersIsKnown"
                    onClick={() => setAmountOfChaptersIsKnown((prev) => !prev)}
                  />
                  <Label
                    htmlFor="amountOfChaptersIsKnown"
                    className="text-base cursor-pointer"
                  >
                    {t("chaptersQuestion")}
                  </Label>
                </div>
                {amountOfChaptersIsKnown && (
                  <>
                    <Label htmlFor="amountOfChapters" className="text-base">
                      {t("amountOfChapters")}
                    </Label>
                    <Input
                      id="amountOfChapters"
                      name="amountOfChapters"
                      type="number"
                      defaultValue={""}
                    />
                  </>
                )}
              </>
            )}
            <SubmitButton />
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
