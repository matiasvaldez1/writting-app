import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import {
  AnalyticsTypeEnum,
  BooksTable,
  ChaptersTable,
  UserAnalyticsTable,
} from "@/drizzle/schema";
import type { booksZodType } from "@/types/types";

export async function verifyBookOwnership({
  bookId,
  userId,
}: {
  bookId: number;
  userId: number;
}) {
  const [book] = await db
    .select({ id: BooksTable.id })
    .from(BooksTable)
    .where(and(eq(BooksTable.id, bookId), eq(BooksTable.userId, userId)));

  if (!book) {
    throw new Error("Book not found or access denied");
  }
  return book;
}

export async function createBook({ values }: { values: booksZodType }) {
  const { userId, bookDescription, bookName, amountOfChapters } = values;

  const [bookAdded] = await db
    .insert(BooksTable)
    .values({
      userId,
      bookDescription,
      bookName,
      amountOfChapters,
    })
    .returning();

  const chapterCount = amountOfChapters || 1;
  for (let i = 1; i <= chapterCount; i++) {
    await db
      .insert(ChaptersTable)
      .values({
        bookId: bookAdded.id,
        chapterNumber: i,
        chapterTitle: `Chapter ${i}`,
        chapterText: "",
        chapterDescription: `Chapter ${i} Description`,
      })
      .execute();
  }

  return bookAdded;
}

export async function deleteBook({
  bookId,
  userId,
}: {
  bookId: number;
  userId: number;
}) {
  await verifyBookOwnership({ bookId, userId });

  const [bookDeleted] = await db
    .delete(BooksTable)
    .where(and(eq(BooksTable.id, bookId), eq(BooksTable.userId, userId)))
    .returning();

  return bookDeleted;
}

export async function getUserBooks({ userId }: { userId: number }) {
  const books = await db
    .select()
    .from(BooksTable)
    .where(eq(BooksTable.userId, userId))
    .orderBy(BooksTable.createdAt);

  return books;
}

export async function getBookAndChapters({
  bookId,
  userId,
}: {
  bookId: number;
  userId: number;
}) {
  await verifyBookOwnership({ bookId, userId });

  const [book] = await db
    .select()
    .from(BooksTable)
    .where(eq(BooksTable.id, bookId));

  const chapters = await db
    .select()
    .from(ChaptersTable)
    .where(eq(ChaptersTable.bookId, bookId))
    .orderBy(ChaptersTable.chapterNumber);

  return { ...book, chapters };
}

export async function getBookAndChapter({
  bookId,
  chapterId,
  userId,
}: {
  bookId: number;
  chapterId: number;
  userId: number;
}) {
  await verifyBookOwnership({ bookId, userId });

  const [book] = await db
    .select({ bookName: BooksTable.bookName })
    .from(BooksTable)
    .where(eq(BooksTable.id, bookId));

  const [chapter] = await db
    .select({
      id: ChaptersTable.id,
      chapterTitle: ChaptersTable.chapterTitle,
      chapterNumber: ChaptersTable.chapterNumber,
      chapterDescription: ChaptersTable.chapterDescription,
      chapterText: ChaptersTable.chapterText,
    })
    .from(ChaptersTable)
    .where(
      and(eq(ChaptersTable.id, chapterId), eq(ChaptersTable.bookId, bookId))
    );

  return { ...book, chapter };
}

export async function updateChapterField({
  bookId,
  chapterId,
  newTextContent,
  userId,
}: {
  bookId: number;
  chapterId: number;
  newTextContent: string;
  userId: number;
}) {
  await verifyBookOwnership({ bookId, userId });

  const [updatedChapter] = await db
    .update(ChaptersTable)
    .set({ chapterText: newTextContent })
    .where(
      and(eq(ChaptersTable.bookId, bookId), eq(ChaptersTable.id, chapterId))
    )
    .returning();

  return updatedChapter;
}

export async function updateChapterDescription({
  bookId,
  chapterId,
  newTextContent,
  userId,
}: {
  bookId: number;
  chapterId: number;
  newTextContent: string;
  userId: number;
}) {
  await verifyBookOwnership({ bookId, userId });

  const [updatedChapter] = await db
    .update(ChaptersTable)
    .set({ chapterDescription: newTextContent })
    .where(
      and(eq(ChaptersTable.bookId, bookId), eq(ChaptersTable.id, chapterId))
    )
    .returning();

  return updatedChapter;
}

export async function updateChapterTitle({
  bookId,
  chapterId,
  newTextContent,
  userId,
}: {
  bookId: number;
  chapterId: number;
  newTextContent: string;
  userId: number;
}) {
  await verifyBookOwnership({ bookId, userId });

  const [updatedChapter] = await db
    .update(ChaptersTable)
    .set({ chapterTitle: newTextContent })
    .where(
      and(eq(ChaptersTable.bookId, bookId), eq(ChaptersTable.id, chapterId))
    )
    .returning();

  return updatedChapter;
}

export async function swapChapterNumber({
  bookId,
  idsOfNewOrder,
  userId,
}: {
  bookId: number;
  idsOfNewOrder: number[];
  userId: number;
}) {
  await verifyBookOwnership({ bookId, userId });

  for (let i = 0; i < idsOfNewOrder.length; i++) {
    const chapterId = idsOfNewOrder[i];
    await db
      .update(ChaptersTable)
      .set({ chapterNumber: i + 1 })
      .where(
        and(eq(ChaptersTable.bookId, bookId), eq(ChaptersTable.id, chapterId))
      )
      .execute();
  }

  return true;
}

export async function addChapter({
  bookId,
  userId,
}: {
  bookId: number;
  userId: number;
}) {
  await verifyBookOwnership({ bookId, userId });

  const existingChapters = await db
    .select({ chapterNumber: ChaptersTable.chapterNumber })
    .from(ChaptersTable)
    .where(eq(ChaptersTable.bookId, bookId))
    .orderBy(ChaptersTable.chapterNumber);

  const nextNumber =
    existingChapters.length > 0
      ? existingChapters[existingChapters.length - 1].chapterNumber + 1
      : 1;

  const [newChapter] = await db
    .insert(ChaptersTable)
    .values({
      bookId,
      chapterNumber: nextNumber,
      chapterTitle: `Chapter ${nextNumber}`,
      chapterText: "",
      chapterDescription: `Chapter ${nextNumber} Description`,
    })
    .returning();

  await db
    .update(BooksTable)
    .set({ amountOfChapters: nextNumber })
    .where(eq(BooksTable.id, bookId));

  return newChapter;
}

export async function deleteChapter({
  bookId,
  chapterId,
  userId,
}: {
  bookId: number;
  chapterId: number;
  userId: number;
}) {
  await verifyBookOwnership({ bookId, userId });

  const [deleted] = await db
    .delete(ChaptersTable)
    .where(
      and(eq(ChaptersTable.id, chapterId), eq(ChaptersTable.bookId, bookId))
    )
    .returning();

  if (!deleted) {
    throw new Error("Chapter not found");
  }

  const remaining = await db
    .select()
    .from(ChaptersTable)
    .where(eq(ChaptersTable.bookId, bookId))
    .orderBy(ChaptersTable.chapterNumber);

  for (let i = 0; i < remaining.length; i++) {
    await db
      .update(ChaptersTable)
      .set({ chapterNumber: i + 1 })
      .where(eq(ChaptersTable.id, remaining[i].id))
      .execute();
  }

  await db
    .update(BooksTable)
    .set({ amountOfChapters: remaining.length })
    .where(eq(BooksTable.id, bookId));

  return deleted;
}

export async function updateBookMetadata({
  bookId,
  userId,
  bookName,
  bookDescription,
}: {
  bookId: number;
  userId: number;
  bookName?: string;
  bookDescription?: string;
}) {
  await verifyBookOwnership({ bookId, userId });

  const updates: Partial<{ bookName: string; bookDescription: string }> = {};
  if (bookName !== undefined) updates.bookName = bookName;
  if (bookDescription !== undefined) updates.bookDescription = bookDescription;

  const [updated] = await db
    .update(BooksTable)
    .set(updates)
    .where(and(eq(BooksTable.id, bookId), eq(BooksTable.userId, userId)))
    .returning();

  return updated;
}

export async function addWritingSession({
  userId,
  sessionTimeInMilliseconds,
}: {
  userId: number;
  sessionTimeInMilliseconds: number;
}) {
  const [newRecord] = await db
    .insert(UserAnalyticsTable)
    .values({
      userId,
      type: AnalyticsTypeEnum.enumValues[0],
      value: Math.round(sessionTimeInMilliseconds / 1000),
    })
    .returning();

  return newRecord;
}

export async function getUserAnalytics({ userId }: { userId: number }) {
  const analytics = await db
    .select()
    .from(UserAnalyticsTable)
    .where(eq(UserAnalyticsTable.userId, userId));

  return analytics;
}
