export const dynamic = "force-dynamic";

import { getUserBooks } from "@/app/_actions/books";
import CreateBookDialog from "./_components/create-book-dialog";
import BookImageByTheme from "./_components/book-image-by-theme";
import PageHeading from "@/components/ui/page-header";
import BookOptionsDropdown from "./_components/book-options-dropdown";
import Link from "next/link";

export default async function Books() {
  const { books } = await getUserBooks();

  return (
    <div>
      <div className="flex w-full justify-between">
        <PageHeading title="Your books" />
        <CreateBookDialog />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 my-8">
        {books.length === 0 && <h2>There are not books created yet.</h2>}
        {books.map((book) => (
          <div className="flex justify-start mb-4" key={book.id}>
            <div className="w-fit border border-gray-100 p-4 rounded">
              <div className="flex justify-between">
                <h2 className="text-xl">{book.bookName}</h2>
                <BookOptionsDropdown bookId={book.id} />
              </div>
              <Link href={`/dashboard/books/${book.id}/edit`}>
                <div className="cursor-pointer">
                  <BookImageByTheme />
                </div>
              </Link>
              <p className="font-medium">{book.bookDescription}</p>
              {Boolean(book.amountOfChapters) && (
                <p className="font-medium">
                  Your book currently has {book.amountOfChapters} pages
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
