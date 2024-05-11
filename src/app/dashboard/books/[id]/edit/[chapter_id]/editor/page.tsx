import { getUserBookAndChapter } from "@/app/_actions/books";
import PageHeading from "@/components/ui/page-header";
import Tiptap from "@/components/ui/custom-editor";

export default async function EditChapter({
  params,
}: {
  params: { id: string; chapter_id: string };
}) {
  const { id: bookId, chapter_id: chapterId } = params;
  const integerBookId = Number(bookId);
  const integerChapterId = Number(chapterId);

  const { bookAndChapter } = await getUserBookAndChapter(
    integerBookId,
    integerChapterId
  );

  return (
    <div>
      <PageHeading
        title={`Edit chapter N°${bookAndChapter.chapter.chapterNumber}: 
        ${bookAndChapter.chapter.chapterTitle}`}
      />
      <div className="my-8">
        <Tiptap
          bookId={integerBookId}
          chapterId={integerChapterId}
          content={bookAndChapter.chapter.chapterText}
        />
      </div>
    </div>
  );
}
