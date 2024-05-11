import {
  createBook,
  deleteBook,
  getBookAndChapter,
  getBookAndChapters,
  getUserBooks,
  updateChapterField,
} from "@/data-access/books";
import { booksZodType } from "@/types/types";

export async function createBookUseCase({ values }: { values: booksZodType }) {
  const { bookDescription, bookName, userId } = values;
  if (!bookDescription) {
    throw new Error("The book must have a book description");
  }
  if (!bookName) {
    throw new Error("The book must have a book name");
  }
  if (!userId) {
    throw new Error("The book must be linked to a userId");
  }
  const book = await createBook({ values });

  return book;
}

export async function deleteBookUseCase({ bookId }: { bookId: number }) {
  if (!bookId) {
    throw new Error("No bookId attached");
  }
  const bookDeleted = await deleteBook({ bookId });

  return bookDeleted;
}

export async function getUserBooksUseCase({ userId }: { userId: number }) {
  if (!userId) {
    throw new Error("No userId attached");
  }
  const books = await getUserBooks({ userId });

  return books;
}

export async function getUserBookAndChaptersUseCase({
  bookId,
}: {
  bookId: number;
}) {
  if (!bookId) {
    throw new Error("No bookId attached");
  }
  const booksAndChapters = await getBookAndChapters({ bookId });

  return booksAndChapters;
}

export async function getUserBookAndChapterUseCase({
  bookId,
  chapterId,
}: {
  bookId: number;
  chapterId: number;
}) {
  if (!bookId) {
    throw new Error("No bookId attached");
  }
  if (!chapterId) {
    throw new Error("No chapterId attached");
  }
  const booksAndChapters = await getBookAndChapter({ bookId, chapterId });

  return booksAndChapters;
}

export async function updateChapterTextContentUseCase({
  bookId,
  chapterId,
  newTextContent,
}: {
  bookId: number;
  chapterId: number;
  newTextContent: string;
}) {
  if (!bookId) {
    throw new Error("No bookId attached");
  }
  if (!chapterId) {
    throw new Error("No chapterId attached");
  }
  if (!newTextContent) {
    throw new Error("No newTextContent attached");
  }
  const booksAndChapters = await updateChapterField({
    bookId,
    chapterId,
    newTextContent,
  });

  return booksAndChapters;
}
