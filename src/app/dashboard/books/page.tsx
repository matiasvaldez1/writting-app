export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getUserBooks } from "@/app/_actions/books";
import { getUserTagsAction } from "@/app/_actions/tags";
import { getTagsForBooks } from "@/data-access/tags";
import PageHeading from "@/components/ui/page-header";
import CreateBookDialog from "./_components/create-book-dialog";
import BooksGrid from "./_components/books-grid";

export default async function Books({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string; status?: string };
}) {
  const { books } = await getUserBooks({
    search: searchParams.q,
    sort: searchParams.sort,
    status: searchParams.status,
  });
  const { tags: userTags } = await getUserTagsAction();
  const t = await getTranslations("books");

  const bookIds = books.map((b) => b.id);
  const tagsMap = await getTagsForBooks({ bookIds });
  const booksWithTags = books.map((b) => ({
    ...b,
    tags: tagsMap[b.id] ?? [],
  }));

  return (
    <div className="px-4 md:px-6 py-4">
      <div className="flex w-full justify-between items-center">
        <PageHeading title={t("title")} />
        <CreateBookDialog userTags={userTags} />
      </div>
      <Suspense fallback={null}>
        <BooksGrid books={booksWithTags} />
      </Suspense>
    </div>
  );
}
