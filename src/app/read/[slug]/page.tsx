import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getBookBySlugUseCase } from "@/use-cases/books";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const book = await getBookBySlugUseCase({ slug: params.slug });
  if (!book) return { title: "Not found" };

  return {
    title: `${book.bookName} — Escribí`,
    description: book.bookDescription,
    openGraph: {
      title: book.bookName,
      description: book.bookDescription,
      type: "article",
      authors: [book.authorName],
    },
    twitter: {
      card: "summary_large_image",
      title: book.bookName,
      description: book.bookDescription,
    },
  };
}

export default async function ReadPage({
  params,
}: {
  params: { slug: string };
}) {
  const book = await getBookBySlugUseCase({ slug: params.slug });
  const t = await getTranslations("readPage");

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border/40 px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Escribí
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {book.bookName}
        </h1>
        <p className="text-muted-foreground mb-1">{book.bookDescription}</p>
        <p className="text-sm text-muted-foreground mb-12">
          {t("by")} {book.authorName}
        </p>
        <div className="space-y-12">
          {book.chapters.map((chapter) => (
            <article key={chapter.id}>
              <h2 className="text-2xl font-semibold mb-4">
                {chapter.chapterTitle}
              </h2>
              <div
                className="prose prose-lg dark:prose-invert max-w-none leading-relaxed [&_ol]:list-decimal [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: chapter.chapterText }}
              />
            </article>
          ))}
        </div>
      </main>
      <footer className="border-t border-border/40 px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Escribí
          </Link>
        </p>
      </footer>
    </div>
  );
}
