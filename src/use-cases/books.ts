import { createBook, getUserBooks } from "@/data-access/books";
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

export async function getUserBooksUseCase({ userId }: { userId: number }) {
  if (!userId) {
    throw new Error("No userId attached");
  }
  const books = await getUserBooks({ userId });

  return books
}
