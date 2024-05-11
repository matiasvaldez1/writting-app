import { getUserBookAndChapter } from "@/app/_actions/books";
import PageHeading from "@/components/ui/page-header";
import Tiptap from "@/components/ui/tip-tap";

export default async function EditChapter({
  params,
}: {
  params: { id: string; chapter_id: string };
}) {
  const { id: bookId, chapter_id: chapterId } = params;
  const { bookAndChapter } = await getUserBookAndChapter(
    Number(bookId),
    Number(chapterId)
  );

  return (
    <div>
      <PageHeading
        title={`Edit chapter N°${bookAndChapter.chapter.chapterNumber}: 
        ${bookAndChapter.chapter.chapterTitle}`}
      />
      <div className="my-8">
        <Tiptap content={bookAndChapter.chapter.chapterText} />
      </div>
    </div>
  );
}
