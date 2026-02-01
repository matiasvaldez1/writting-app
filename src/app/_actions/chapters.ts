"use server";

import { revalidatePath } from "next/cache";
import { swapChaptersUseCase } from "@/use-cases/books";
import { getUserByClerkIdUseCase } from "@/use-cases/user";

export async function swapChaptersAction(
  bookId: number,
  idsOfNewOrder: number[]
) {
  const user = await getUserByClerkIdUseCase();
  const chaptersUpdated = await swapChaptersUseCase({
    bookId,
    idsOfNewOrder,
    userId: user.id,
  });

  revalidatePath(`/dashboard/books/${bookId}/edit`);

  return {
    status: "success",
    chaptersUpdated,
  };
}
