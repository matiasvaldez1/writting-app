"use client";

import React, { useState } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BooksAndChapters } from "@/types/types";
import PreviewLinkDownload from "./book-download-link";
import PdfDocumentFromBook from "./book-pdf-document";

export default function PreviewBookPdf({
  bookAndChapters,
}: {
  bookAndChapters: BooksAndChapters;
}) {
  const t = useTranslations("editBook");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("previewPdf")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("previewPdf")}</DialogTitle>
          <DialogDescription>{t("previewPdfDescription")}</DialogDescription>
        </DialogHeader>
        {open && (
          <BlobProvider
            document={<PdfDocumentFromBook bookAndChapters={bookAndChapters} />}
          >
            {({ url, loading }) =>
              loading ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  {t("loading")}
                </div>
              ) : (
                <iframe
                  src={url ?? undefined}
                  className="flex-1 w-full rounded border border-border"
                />
              )
            }
          </BlobProvider>
        )}
        <PreviewLinkDownload bookAndChapters={bookAndChapters} />
      </DialogContent>
    </Dialog>
  );
}
