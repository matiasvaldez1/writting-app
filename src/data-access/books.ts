import { db } from "@/drizzle/db";
import { BooksTable } from "@/drizzle/schema";
import { booksZodType } from "@/types/types";

export async function createBook({ values }: { values: booksZodType }) {
  const [bookAdded] = await db
    .insert(BooksTable)
    .values({
      userId: values.userId,
      bookDescription: values.bookDescription,
      bookName: values.bookName,
      amountOfChapters: values.amountOfChapters,
    })
    .returning();

  return bookAdded;
}
