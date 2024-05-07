"use server";

import { booksZodSchema } from "@/types/zodSchemas";
import { createBookUseCase, getUserBooksUseCase } from "@/use-cases/books";
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

export async function getUserBooks() {
  const user = await getUserByClerkIdUseCase();
  const books = await getUserBooksUseCase({ userId: user.userId! });

  return {
    books,
  };
}
