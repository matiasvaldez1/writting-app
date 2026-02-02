"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BookImageByTheme from "./book-image-by-theme";
import BookOptionsDropdown from "./book-options-dropdown";

type Book = {
  id: number;
  bookName: string;
  bookDescription: string;
  amountOfChapters: number | null;
  createdAt: Date;
};

export default function BooksGrid({ books }: { books: Book[] }) {
  const t = useTranslations("books");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateParams("q", value);
      }, 300);
    },
    [updateParams]
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-4">
        <Input
          placeholder={t("searchPlaceholder")}
          defaultValue={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <Select value={sort} onValueChange={(v) => updateParams("sort", v)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("newest")}</SelectItem>
            <SelectItem value="oldest">{t("oldest")}</SelectItem>
            <SelectItem value="name">{t("nameAZ")}</SelectItem>
            <SelectItem value="chapters">{t("mostChapters")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {books.length === 0 && search && (
          <p className="text-muted-foreground">{t("noMatch")}</p>
        )}
        {books.length === 0 && !search && <h2>{t("noBooks")}</h2>}
        {books.map((book) => (
          <div className="flex justify-start mb-4" key={book.id}>
            <div className="w-full max-w-sm border border-border bg-card rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <h2 className="text-xl font-semibold truncate">
                  {book.bookName}
                </h2>
                <BookOptionsDropdown bookId={book.id} />
              </div>
              <Link href={`/dashboard/books/${book.id}/edit`}>
                <div className="cursor-pointer rounded-lg overflow-hidden bg-muted">
                  <BookImageByTheme />
                </div>
              </Link>
              <p className="text-muted-foreground line-clamp-2">
                {book.bookDescription}
              </p>
              {Boolean(book.amountOfChapters) && (
                <p className="font-medium text-muted-foreground">
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
