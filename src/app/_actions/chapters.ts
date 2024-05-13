"use server"

import { swapChaptersUseCase } from "@/use-cases/books";
import { revalidatePath } from "next/cache";

export async function swapChaptersAction(
  bookId: number,
  idsOfNewOrder: number[]
) {
  const chaptersUpdated = await swapChaptersUseCase({
    bookId,
    idsOfNewOrder
  });

  revalidatePath(`/dashboard/books/${bookId}/edit`);

  return {
    status: "success",
    chaptersUpdated,
  };
}
