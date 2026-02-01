"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import type { BooksAndChapters } from "@/types/types";
import PreviewLinkDownload from "./book-download-link";

export default function PreviewBookPdf({
  bookAndChapters,
}: {
  bookAndChapters: BooksAndChapters;
}) {
  const t = useTranslations("editBook");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger
        onClick={() => setOpen((prev) => !prev)}
        className="border border-gray-800 rounded-md p-3"
      >
        {t("previewPdf")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="my-5">{t("previewPdf")}</DialogTitle>
          <DialogDescription>{t("previewPdfDescription")}</DialogDescription>
        </DialogHeader>
        <PreviewLinkDownload bookAndChapters={bookAndChapters} />
      </DialogContent>
    </Dialog>
  );
}
