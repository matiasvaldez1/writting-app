"use server";

import { booksZodSchema } from "@/types/zodSchemas";
import {
  createBookUseCase,
  deleteBookUseCase,
  getUserBookAndChapterUseCase,
  getUserBookAndChaptersUseCase,
  getUserBooksUseCase,
  updateChapterDescriptionUseCase,
  updateChapterTextContentUseCase,
} from "@/use-cases/books";
import { getUserByClerkIdUseCase } from "@/use-cases/user";
import { revalidatePath } from "next/cache";
import z from "zod";

const createBookActionSchema = booksZodSchema
  .extend({ amountOfChapters: z.string().nullish() })
  .omit({ userId: true });

export async function createBookAction(param: unknown, formData: FormData) {
  const result = createBookActionSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!result.success) {
    return { ...result.error.formErrors.fieldErrors, status: "error" };
  }

  const user = await getUserByClerkIdUseCase();
  const data = result.data;
  await createBookUseCase({
    values: {
      ...data,
      userId: user.id!,
      amountOfChapters: Number(data.amountOfChapters ?? 0),
    },
  });
  revalidatePath("/dashboard/books");
  return {
    status: "success",
  };
}

export async function deleteBookAction(bookId: number) {
  const bookDeleted = await deleteBookUseCase({ bookId });
  if (bookDeleted) {
    revalidatePath("/dashboard/books");
  }
}

export async function getUserBooks() {
  const user = await getUserByClerkIdUseCase();
  const books = await getUserBooksUseCase({ userId: user.userId! });

  return {
    status: "success",
    books,
  };
}

export async function getUserBookAndChapters(bookId: number) {
  const bookAndChapters = await getUserBookAndChaptersUseCase({ bookId });

  return {
    status: "success",
    bookAndChapters,
  };
}

export async function getUserBookAndChapter(bookId: number, chapterId: number) {
  const bookAndChapter = await getUserBookAndChapterUseCase({
    bookId,
    chapterId,
  });

  return {
    status: "success",
    bookAndChapter,
  };
}

export async function updateChapterTextContent(
  bookId: number,
  chapterId: number,
  newValue: string
) {
  const chapterUpdated = await updateChapterTextContentUseCase({
    bookId,
    chapterId,
    newTextContent: newValue,
  });

  return {
    status: "success",
    chapterUpdated,
  };
}

export async function updateChapterTitle(
  bookId: number,
  chapterId: number,
  newValue: string
) {
  const chapterUpdated = await updateChapterTextContentUseCase({
    bookId,
    chapterId,
    newTextContent: newValue,
  });

  revalidatePath(`/dashboard/books/${bookId}/edit`);

  return {
    status: "success",
    chapterUpdated,
  };
}
export async function updateChapterDescription(
  bookId: number,
  chapterId: number,
  newValue: string
) {
  const chapterUpdated = await updateChapterDescriptionUseCase({
    bookId,
    chapterId,
    newTextContent: newValue,
  });

  revalidatePath(`/dashboard/books/${bookId}/edit`);

  return {
    status: "success",
    chapterUpdated,
  };
}
