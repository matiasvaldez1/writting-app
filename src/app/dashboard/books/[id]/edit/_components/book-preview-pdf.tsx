"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { BooksAndChapters } from "@/types/types";
import PreviewLinkDownload from "./book-download-link";

export default function PreviewBookPdf({
  bookAndChapters,
}: {
  bookAndChapters: BooksAndChapters;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger
        onClick={() => setOpen((prev) => !prev)}
        className="border border-gray-800 rounded-md p-3"
      >
        Preview PDF
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="my-5">Preview PDF</DialogTitle>
          <DialogDescription>
            Download a your PDF document from your book. Export it and
            previsualize it in your favorite device.
          </DialogDescription>
        </DialogHeader>
        <PreviewLinkDownload bookAndChapters={bookAndChapters} />
      </DialogContent>
    </Dialog>
  );
}
