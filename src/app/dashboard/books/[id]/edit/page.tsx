export const dynamic = "force-dynamic";

import { getUserBookAndChapters } from "@/app/_actions/books";
import ChaptersList from "./_components/chapters-list";
import PreviewBookPdf from "./_components/book-preview-pdf";
import EditableBookFields from "./_components/editable-book-fields";

export default async function EditBook({ params }: { params: { id: string } }) {
  const { bookAndChapters } = await getUserBookAndChapters(Number(params.id));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between w-full items-start gap-4">
        <EditableBookFields
          bookId={Number(params.id)}
          initialName={bookAndChapters.bookName}
          initialDescription={bookAndChapters.bookDescription}
        />
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
