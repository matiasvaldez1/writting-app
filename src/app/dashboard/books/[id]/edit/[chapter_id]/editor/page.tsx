import { notFound } from "next/navigation";
import { getUserBookAndChapter } from "@/app/_actions/books";
import Tiptap from "@/app/dashboard/books/[id]/edit/[chapter_id]/editor/_components/custom-editor";

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

  if (!bookAndChapter?.chapter) {
    notFound();
  }

  return (
    <Tiptap
      bookId={integerBookId}
      chapterId={integerChapterId}
      content={bookAndChapter.chapter.chapterText}
      chapterTitle={bookAndChapter.chapter.chapterTitle}
      prevChapterId={bookAndChapter.prevChapterId}
      nextChapterId={bookAndChapter.nextChapterId}
      allChapters={bookAndChapter.allChapters}
    />
  );
}
