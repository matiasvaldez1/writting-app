export const dynamic = "force-dynamic";

import { getUserBookAndChapters } from "@/app/_actions/books";
import { getUserTagsAction } from "@/app/_actions/tags";
import { getBookTags } from "@/data-access/tags";
import ChaptersList from "./_components/chapters-list";
import PreviewBookPdf from "./_components/book-preview-pdf";
import EditableBookFields from "./_components/editable-book-fields";
import ShareToggle from "./_components/share-toggle";
import BookStatusTags from "./_components/book-status-tags";

export default async function EditBook({ params }: { params: { id: string } }) {
  const { bookAndChapters } = await getUserBookAndChapters(Number(params.id));
  const { tags: userTags } = await getUserTagsAction();
  const bookTags = await getBookTags({ bookId: Number(params.id) });
  const bookTagIds = bookTags.map((t) => t.id);

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
      <div className="my-4 max-w-md">
        <BookStatusTags
          bookId={Number(params.id)}
          initialStatus={bookAndChapters.status}
          initialBookTagIds={bookTagIds}
          userTags={userTags}
        />
      </div>
      <div className="my-4 max-w-md">
        <ShareToggle
          bookId={Number(params.id)}
          initialIsPublic={bookAndChapters.isPublic}
          initialSlug={bookAndChapters.publicSlug}
        />
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
