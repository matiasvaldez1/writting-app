import { booksZodSchema } from "@/types/zodSchemas";
import { createBookUseCase } from "@/use-cases/books";
import { getUserByClerkIdUseCase } from "@/use-cases/user";
import { revalidatePath } from "next/cache";

export async function createBookAction(param: unknown, formData: FormData) {
  const result = booksZodSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  console.log("RES", Object.fromEntries(formData.entries()), result.error);
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }
  const user = await getUserByClerkIdUseCase();

  const data = result.data;
  const book = await createBookUseCase({
    values: { ...data, userId: user.id! },
  });

  if (book) {
    revalidatePath("/dashboard/books");
  }
}
