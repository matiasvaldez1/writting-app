"use server"

import { booksZodSchema } from "@/types/zodSchemas";
import { createBookUseCase } from "@/use-cases/books";
import { getUserByClerkIdUseCase } from "@/use-cases/user";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createBookAction(param: unknown, formData: FormData) {
  const result = booksZodSchema
    .extend({ amountOfChapters: z.string().nullish() })
    .omit({ userId: true })
    .safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }
  const user = await getUserByClerkIdUseCase();

  const data = result.data;
  const book = await createBookUseCase({
    values: {
      ...data,
      userId: user.id!,
      amountOfChapters: Number(data.amountOfChapters),
    },
  });

  if (book) {
    revalidatePath("/dashboard/books");
  }
}
