import {
  addChapter,
  addWritingSession,
  createBook,
  deleteBook,
  deleteChapter,
  getAllUserChapterTexts,
  getBookAndChapter,
  getBookAndChapters,
  getUserBooks,
  swapChapterNumber,
  updateBookMetadata,
  updateChapterDescription,
  updateChapterField,
  updateChapterTitle,
  type BookSortOption,
} from "@/data-access/books";
import type { booksZodType } from "@/types/types";

export async function createBookUseCase({ values }: { values: booksZodType }) {
  const { bookDescription, bookName, userId } = values;
  if (!bookDescription)
    throw new Error("The book must have a book description");
  if (!bookName) throw new Error("The book must have a book name");
  if (!userId) throw new Error("The book must be linked to a userId");
  return await createBook({ values });
}

export async function deleteBookUseCase({
  bookId,
  userId,
}: {
  bookId: number;
  userId: number;
}) {
  if (!bookId) throw new Error("No bookId attached");
  if (!userId) throw new Error("No userId attached");
  return await deleteBook({ bookId, userId });
}

export async function getUserBooksUseCase({
  userId,
  search,
  sort,
}: {
  userId: number;
  search?: string;
  sort?: BookSortOption;
}) {
  if (!userId) throw new Error("No userId attached");
  return await getUserBooks({ userId, search, sort });
}

export async function getUserBookAndChaptersUseCase({
  bookId,
  userId,
}: {
  bookId: number;
  userId: number;
}) {
  if (!bookId) throw new Error("No bookId attached");
  if (!userId) throw new Error("No userId attached");
  return await getBookAndChapters({ bookId, userId });
}

export async function getUserBookAndChapterUseCase({
  bookId,
  chapterId,
  userId,
}: {
  bookId: number;
  chapterId: number;
  userId: number;
}) {
  if (!bookId) throw new Error("No bookId attached");
  if (!chapterId) throw new Error("No chapterId attached");
  if (!userId) throw new Error("No userId attached");
  return await getBookAndChapter({ bookId, chapterId, userId });
}

export async function updateChapterTextContentUseCase({
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
  if (!bookId) throw new Error("No bookId attached");
  if (!chapterId) throw new Error("No chapterId attached");
  if (newTextContent === undefined || newTextContent === null)
    throw new Error("No newTextContent attached");
  if (!userId) throw new Error("No userId attached");
  return await updateChapterField({
    bookId,
    chapterId,
    newTextContent,
    userId,
  });
}

export async function updateChapterTitleUseCase({
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
  if (!bookId) throw new Error("No bookId attached");
  if (!chapterId) throw new Error("No chapterId attached");
  if (!newTextContent) throw new Error("No newTextContent attached");
  if (!userId) throw new Error("No userId attached");
  return await updateChapterTitle({
    bookId,
    chapterId,
    newTextContent,
    userId,
  });
}

export async function updateChapterDescriptionUseCase({
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
  if (!bookId) throw new Error("No bookId attached");
  if (!chapterId) throw new Error("No chapterId attached");
  if (!newTextContent) throw new Error("No newTextContent attached");
  if (!userId) throw new Error("No userId attached");
  return await updateChapterDescription({
    bookId,
    chapterId,
    newTextContent,
    userId,
  });
}

export async function swapChaptersUseCase({
  bookId,
  idsOfNewOrder,
  userId,
}: {
  bookId: number;
  idsOfNewOrder: number[];
  userId: number;
}) {
  if (!bookId) throw new Error("No bookId attached");
  if (!idsOfNewOrder) throw new Error("No idsOfNewOrder attached");
  if (!userId) throw new Error("No userId attached");
  return await swapChapterNumber({ bookId, idsOfNewOrder, userId });
}

export async function getAllUserChapterTextsUseCase({
  userId,
}: {
  userId: number;
}) {
  if (!userId) throw new Error("No userId attached");
  return await getAllUserChapterTexts({ userId });
}

export async function addWritingSessionUseCase({
  userId,
  sessionTimeInMilliseconds,
}: {
  userId: number;
  sessionTimeInMilliseconds: number;
}) {
  if (!userId) throw new Error("No userId attached");
  if (!sessionTimeInMilliseconds)
    throw new Error("No sessionTimeInMilliseconds attached");
  return await addWritingSession({ userId, sessionTimeInMilliseconds });
}

export async function addChapterUseCase({
  bookId,
  userId,
}: {
  bookId: number;
  userId: number;
}) {
  if (!bookId) throw new Error("No bookId attached");
  if (!userId) throw new Error("No userId attached");
  return await addChapter({ bookId, userId });
}

export async function deleteChapterUseCase({
  bookId,
  chapterId,
  userId,
}: {
  bookId: number;
  chapterId: number;
  userId: number;
}) {
  if (!bookId) throw new Error("No bookId attached");
  if (!chapterId) throw new Error("No chapterId attached");
  if (!userId) throw new Error("No userId attached");
  return await deleteChapter({ bookId, chapterId, userId });
}

export async function updateBookMetadataUseCase({
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
  if (!bookId) throw new Error("No bookId attached");
  if (!userId) throw new Error("No userId attached");
  return await updateBookMetadata({
    bookId,
    userId,
    bookName,
    bookDescription,
  });
}
