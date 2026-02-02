export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getUserBooks } from "@/app/_actions/books";
import PageHeading from "@/components/ui/page-header";
import CreateBookDialog from "./_components/create-book-dialog";
import BooksGrid from "./_components/books-grid";

export default async function Books({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string };
}) {
  const { books } = await getUserBooks({
    search: searchParams.q,
    sort: searchParams.sort,
  });
  const t = await getTranslations("books");

  return (
    <div className="px-4 md:px-6 py-4">
      <div className="flex w-full justify-between items-center">
        <PageHeading title={t("title")} />
        <CreateBookDialog />
      </div>
      <Suspense fallback={null}>
        <BooksGrid books={books} />
      </Suspense>
    </div>
  );
}
