import { db } from "@/drizzle/db";
import { BooksTable, ChaptersTable } from "@/drizzle/schema";
import { booksZodType } from "@/types/types";
import { eq } from "drizzle-orm";

export async function createBook({ values }: { values: booksZodType }) {
  const { userId, bookDescription, bookName, amountOfChapters } = values;

  try {
    const [bookAdded] = await db
      .insert(BooksTable)
      .values({
        userId,
        bookDescription,
        bookName,
        amountOfChapters,
      })
      .returning();

    if (amountOfChapters) {
      for (let i = 1; i <= amountOfChapters; i++) {
        await db
          .insert(ChaptersTable)
          .values({
            bookId: bookAdded.id,
            chapterNumber: i,
            chapterTitle: `Chapter ${i}`,
            chapterText: `Chapter ${i} Text`,
            chapterDescription: `Chapter ${i} Description`,
          })
          .execute();
      }
    } else {
      await db
        .insert(ChaptersTable)
        .values({
          bookId: bookAdded.id,
          chapterNumber: 1,
          chapterTitle: "Chapter 1",
          chapterText: "Chapter 1 Text",
          chapterDescription: "Chapter 1 Description",
        })
        .execute();
    }
    return bookAdded;
  } catch (error) {
    console.error(error);
    throw new Error("There was an error creating the book");
  }
}

export async function deleteBook({ bookId }: { bookId: number }) {
  const [bookDeleted] = await db
    .delete(BooksTable)
    .where(eq(BooksTable.id, bookId))
    .returning();

  return bookDeleted;
}

export async function getUserBooks({ userId }: { userId: number }) {
  const books = await db
    .select()
    .from(BooksTable)
    .where(eq(BooksTable.userId, userId));

  return books;
}

export async function getBookAndChapters({ bookId }: { bookId: number }) {
  try {
    const [books] = await db
      .select({
        bookName: BooksTable.bookName,
        bookDescription: BooksTable.bookDescription,
        amountOfChapters: BooksTable.amountOfChapters,
      })
      .from(BooksTable)
      .where(eq(BooksTable.id, bookId));

    const chapters = await db
      .select({
        id: ChaptersTable.id,
        chapterTitle: ChaptersTable.chapterTitle,
        chapterNumber: ChaptersTable.chapterNumber,
        chapterDescription: ChaptersTable.chapterDescription,
      })
      .from(ChaptersTable)
      .where(eq(ChaptersTable.bookId, bookId));

    const bookAndChapters = { ...books, chapters };
    return bookAndChapters;
  } catch (error) {
    console.error(error);
    throw new Error("There was an error getting the books");
  }
}
