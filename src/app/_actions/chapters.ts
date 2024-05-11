"use server"

import { swapChaptersUseCase } from "@/use-cases/books";
import { revalidatePath } from "next/cache";

export async function swapChaptersAction(
  bookId: number,
  chapterNumber: number,
  destinationChapterNumber: number
) {
  const chaptersUpdated = await swapChaptersUseCase({
    bookId,
    chapterNumber,
    destinationChapterNumber,
  });

  revalidatePath(`/dashboard/books/${bookId}/edit`);

  return {
    status: "success",
    chaptersUpdated,
  };
}
