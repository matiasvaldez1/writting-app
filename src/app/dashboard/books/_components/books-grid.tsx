"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import BookImageByTheme from "./book-image-by-theme";
import BookOptionsDropdown from "./book-options-dropdown";

type Book = {
  id: number;
  bookName: string;
  bookDescription: string;
  amountOfChapters: number | null;
  createdAt: Date;
};

type SortOption = "newest" | "oldest" | "name" | "chapters";

export default function BooksGrid({ books }: { books: Book[] }) {
  const t = useTranslations("books");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    const result = books.filter(
      (book) =>
        book.bookName.toLowerCase().includes(query) ||
        book.bookDescription.toLowerCase().includes(query)
    );

    result.sort((a, b) => {
      switch (sort) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "name":
          return a.bookName.localeCompare(b.bookName);
        case "chapters":
          return (b.amountOfChapters ?? 0) - (a.amountOfChapters ?? 0);
      }
    });

    return result;
  }, [books, search, sort]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 my-4">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="border rounded-md px-3 py-2 text-sm bg-background"
        >
          <option value="newest">{t("newest")}</option>
          <option value="oldest">{t("oldest")}</option>
          <option value="name">{t("nameAZ")}</option>
          <option value="chapters">{t("mostChapters")}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 my-4">
        {filtered.length === 0 && books.length > 0 && (
          <p className="text-muted-foreground">{t("noMatch")}</p>
        )}
        {filtered.length === 0 && books.length === 0 && <h2>{t("noBooks")}</h2>}
        {filtered.map((book) => (
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
                <p className="font-medium text-sm text-muted-foreground">
                  {t("chapters", { count: book.amountOfChapters ?? 0 })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
