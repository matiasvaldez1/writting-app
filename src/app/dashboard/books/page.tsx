export const dynamic = "force-dynamic";

import { getTranslations } from "next-intl/server";
import { getUserBooks } from "@/app/_actions/books";
import PageHeading from "@/components/ui/page-header";
import CreateBookDialog from "./_components/create-book-dialog";
import BooksGrid from "./_components/books-grid";

export default async function Books() {
  const { books } = await getUserBooks();
  const t = await getTranslations("books");

  return (
    <div>
      <div className="flex w-full justify-between">
        <PageHeading title={t("title")} />
        <CreateBookDialog />
      </div>
      <BooksGrid books={books} />
    </div>
  );
}
