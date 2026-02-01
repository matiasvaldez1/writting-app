export const dynamic = "force-dynamic";

import { getUserBooks } from "@/app/_actions/books";
import PageHeading from "@/components/ui/page-header";
import CreateBookDialog from "./_components/create-book-dialog";
import BooksGrid from "./_components/books-grid";

export default async function Books() {
  const { books } = await getUserBooks();

  return (
    <div>
      <div className="flex w-full justify-between">
        <PageHeading title="Your books" />
        <CreateBookDialog />
      </div>
      <BooksGrid books={books} />
    </div>
  );
}
