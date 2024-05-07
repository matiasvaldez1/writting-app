import { db } from "@/drizzle/db";
import { BooksTable } from "@/drizzle/schema";
import { booksZodType } from "@/types/types";
import { eq } from "drizzle-orm";

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

export async function getUserBooks({ userId }: { userId: number }) {
  const books = await db
    .select()
    .from(BooksTable)
    .where(eq(BooksTable.userId, userId));

  return books;
}
