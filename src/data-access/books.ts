import { and, eq, sql, inArray, ilike, or, desc, asc } from "drizzle-orm";
import { db } from "@/drizzle/db";
import {
  AnalyticsTypeEnum,
  BooksTable,
  ChaptersTable,
  UserAnalyticsTable,
  UsersTable,
} from "@/drizzle/schema";
import type { booksZodType } from "@/types/types";
import type { BookStatus } from "@/types/zodSchemas";

export type BookSortOption = "newest" | "oldest" | "name" | "chapters";

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

export async function createBook({
  values,
  initialDocuments,
}: {
  values: booksZodType;
  initialDocuments?: { title: string; description: string; content: string }[];
}) {
  const { userId, bookDescription, bookName, amountOfChapters } = values;

  return await db.transaction(async (tx) => {
    const [bookAdded] = await tx
      .insert(BooksTable)
      .values({ userId, bookDescription, bookName, amountOfChapters })
      .returning();

    let chapterValues;
    if (initialDocuments && initialDocuments.length > 0) {
      chapterValues = initialDocuments.map((doc, i) => ({
        bookId: bookAdded.id,
        chapterNumber: i + 1,
        chapterTitle: doc.title,
        chapterText: doc.content,
        chapterDescription: doc.description,
      }));
    } else {
      const chapterCount = amountOfChapters || 1;
      chapterValues = Array.from({ length: chapterCount }, (_, i) => ({
        bookId: bookAdded.id,
        chapterNumber: i + 1,
        chapterTitle: `Document ${i + 1}`,
        chapterText: "",
        chapterDescription: `Document ${i + 1}`,
      }));
    }

    await tx.insert(ChaptersTable).values(chapterValues);

    return bookAdded;
  });
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

export async function getUserBooks({
  userId,
  search,
  sort = "newest",
  status,
}: {
  userId: number;
  search?: string;
  sort?: BookSortOption;
  status?: BookStatus;
}) {
  const conditions = [eq(BooksTable.userId, userId)];

  if (search) {
    conditions.push(
      or(
        ilike(BooksTable.bookName, `%${search}%`),
        ilike(BooksTable.bookDescription, `%${search}%`)
      )!
    );
  }

  if (status) {
    conditions.push(eq(BooksTable.status, status));
  }

  const orderByMap = {
    newest: desc(BooksTable.createdAt),
    oldest: asc(BooksTable.createdAt),
    name: asc(BooksTable.bookName),
    chapters: desc(BooksTable.amountOfChapters),
  };

  const books = await db
    .select({
      id: BooksTable.id,
      userId: BooksTable.userId,
      bookName: BooksTable.bookName,
      bookDescription: BooksTable.bookDescription,
      amountOfChapters: BooksTable.amountOfChapters,
      status: BooksTable.status,
      createdAt: BooksTable.createdAt,
    })
    .from(BooksTable)
    .where(and(...conditions))
    .orderBy(orderByMap[sort]);

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
    .select({
      id: BooksTable.id,
      userId: BooksTable.userId,
      bookName: BooksTable.bookName,
      bookDescription: BooksTable.bookDescription,
      amountOfChapters: BooksTable.amountOfChapters,
      status: BooksTable.status,
      isPublic: BooksTable.isPublic,
      publicSlug: BooksTable.publicSlug,
      createdAt: BooksTable.createdAt,
    })
    .from(BooksTable)
    .where(eq(BooksTable.id, bookId));

  const chapters = await db
    .select({
      id: ChaptersTable.id,
      bookId: ChaptersTable.bookId,
      chapterNumber: ChaptersTable.chapterNumber,
      chapterTitle: ChaptersTable.chapterTitle,
      chapterDescription: ChaptersTable.chapterDescription,
      chapterText: ChaptersTable.chapterText,
      createdAt: ChaptersTable.createdAt,
    })
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

  const allChapters = await db
    .select({
      id: ChaptersTable.id,
      chapterNumber: ChaptersTable.chapterNumber,
      chapterTitle: ChaptersTable.chapterTitle,
    })
    .from(ChaptersTable)
    .where(eq(ChaptersTable.bookId, bookId))
    .orderBy(ChaptersTable.chapterNumber);

  const currentIndex = allChapters.findIndex((c) => c.id === chapterId);
  const prevChapterId =
    currentIndex > 0 ? allChapters[currentIndex - 1].id : null;
  const nextChapterId =
    currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1].id
      : null;

  return { ...book, chapter, prevChapterId, nextChapterId, allChapters };
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

  if (idsOfNewOrder.length === 0) return true;

  const cases = idsOfNewOrder
    .map((id, i) => sql`WHEN ${ChaptersTable.id} = ${id} THEN ${i + 1}`)
    .reduce((acc, c) => sql`${acc} ${c}`);

  await db
    .update(ChaptersTable)
    .set({ chapterNumber: sql`(CASE ${cases} END)::integer` })
    .where(
      and(
        eq(ChaptersTable.bookId, bookId),
        inArray(ChaptersTable.id, idsOfNewOrder)
      )
    );

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
    .select({ id: ChaptersTable.id })
    .from(ChaptersTable)
    .where(eq(ChaptersTable.bookId, bookId))
    .orderBy(ChaptersTable.chapterNumber);

  if (remaining.length > 0) {
    const cases = remaining
      .map((ch, i) => sql`WHEN ${ChaptersTable.id} = ${ch.id} THEN ${i + 1}`)
      .reduce((acc, c) => sql`${acc} ${c}`);

    await db
      .update(ChaptersTable)
      .set({ chapterNumber: sql`(CASE ${cases} END)::integer` })
      .where(
        inArray(
          ChaptersTable.id,
          remaining.map((ch) => ch.id)
        )
      );
  }

  await db
    .update(BooksTable)
    .set({ amountOfChapters: remaining.length })
    .where(eq(BooksTable.id, bookId));

  return deleted;
}

export async function updateBookStatus({
  bookId,
  userId,
  status,
}: {
  bookId: number;
  userId: number;
  status: BookStatus;
}) {
  await verifyBookOwnership({ bookId, userId });

  const [updated] = await db
    .update(BooksTable)
    .set({ status })
    .where(and(eq(BooksTable.id, bookId), eq(BooksTable.userId, userId)))
    .returning();

  return updated;
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

export async function getAllUserChapterTexts({ userId }: { userId: number }) {
  const rows = await db
    .select({ chapterText: ChaptersTable.chapterText })
    .from(ChaptersTable)
    .innerJoin(BooksTable, eq(ChaptersTable.bookId, BooksTable.id))
    .where(eq(BooksTable.userId, userId));

  return rows.map((r) => r.chapterText);
}

export async function getUserAnalytics({ userId }: { userId: number }) {
  const analytics = await db
    .select({
      id: UserAnalyticsTable.id,
      userId: UserAnalyticsTable.userId,
      type: UserAnalyticsTable.type,
      value: UserAnalyticsTable.value,
      createdAt: UserAnalyticsTable.createdAt,
    })
    .from(UserAnalyticsTable)
    .where(eq(UserAnalyticsTable.userId, userId));

  return analytics;
}

export async function recordWordCount({
  userId,
  wordsDelta,
}: {
  userId: number;
  wordsDelta: number;
}) {
  if (wordsDelta <= 0) return null;
  const [record] = await db
    .insert(UserAnalyticsTable)
    .values({
      userId,
      type: AnalyticsTypeEnum.enumValues[2],
      value: wordsDelta,
    })
    .returning();
  return record;
}

export async function updateDailyWordGoal({
  userId,
  goal,
}: {
  userId: number;
  goal: number;
}) {
  const [updated] = await db
    .update(UsersTable)
    .set({ dailyWordGoal: goal })
    .where(eq(UsersTable.id, userId))
    .returning();
  return updated;
}

export async function getDailyWordGoal({ userId }: { userId: number }) {
  const [user] = await db
    .select({ dailyWordGoal: UsersTable.dailyWordGoal })
    .from(UsersTable)
    .where(eq(UsersTable.id, userId));
  return user?.dailyWordGoal ?? 0;
}

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

export async function toggleBookPublic({
  bookId,
  userId,
}: {
  bookId: number;
  userId: number;
}) {
  await verifyBookOwnership({ bookId, userId });

  const [book] = await db
    .select({
      isPublic: BooksTable.isPublic,
      publicSlug: BooksTable.publicSlug,
      bookName: BooksTable.bookName,
    })
    .from(BooksTable)
    .where(eq(BooksTable.id, bookId));

  const newIsPublic = !book.isPublic;
  const slug =
    newIsPublic && !book.publicSlug
      ? generateSlug(book.bookName)
      : book.publicSlug;

  const [updated] = await db
    .update(BooksTable)
    .set({ isPublic: newIsPublic, publicSlug: slug })
    .where(eq(BooksTable.id, bookId))
    .returning();

  return updated;
}

export async function getBookBySlug({ slug }: { slug: string }) {
  const [book] = await db
    .select({
      id: BooksTable.id,
      bookName: BooksTable.bookName,
      bookDescription: BooksTable.bookDescription,
      isPublic: BooksTable.isPublic,
      publicSlug: BooksTable.publicSlug,
      createdAt: BooksTable.createdAt,
      authorName: UsersTable.name,
    })
    .from(BooksTable)
    .innerJoin(UsersTable, eq(BooksTable.userId, UsersTable.id))
    .where(and(eq(BooksTable.publicSlug, slug), eq(BooksTable.isPublic, true)));

  if (!book) return null;

  const chapters = await db
    .select({
      id: ChaptersTable.id,
      chapterNumber: ChaptersTable.chapterNumber,
      chapterTitle: ChaptersTable.chapterTitle,
      chapterText: ChaptersTable.chapterText,
    })
    .from(ChaptersTable)
    .where(eq(ChaptersTable.bookId, book.id))
    .orderBy(ChaptersTable.chapterNumber);

  return { ...book, chapters };
}
