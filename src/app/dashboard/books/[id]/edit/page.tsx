export const dynamic = "force-dynamic";

import { getUserBookAndChapters } from "@/app/_actions/books";
import PageHeading from "@/components/ui/page-header";
import ChaptersList from "./_components/chapters-list";
import PreviewBookPdf from "./_components/book-preview-pdf";

export default async function EditBook({ params }: { params: { id: string } }) {
  const { bookAndChapters } = await getUserBookAndChapters(Number(params.id));

  return (
    <div>
      <div className="flex justify-between w-full">
        <PageHeading title={`Edit book - ${bookAndChapters.bookName}`} />
        <PreviewBookPdf bookAndChapters={bookAndChapters} />
      </div>
      <div className="my-8">
        <ChaptersList
          bookAndChapters={bookAndChapters}
          bookId={Number(params.id)}
        />
      </div>
    </div>
  );
}
