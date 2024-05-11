import { getUserBookAndChapters } from "@/app/_actions/books";
import PageHeading from "@/components/ui/page-header";
import { DragHandleDots1Icon } from "@radix-ui/react-icons";
import Link from "next/link";

export default async function EditBook({ params }: { params: { id: string } }) {
  const { bookAndChapters } = await getUserBookAndChapters(Number(params.id));

  return (
    <div>
      <PageHeading title={`Edit book - ${bookAndChapters.bookName}`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        {bookAndChapters.chapters.map((chapter) => (
          <div
            className="flex justify-between border border-gray-100 p-5 rounded"
            key={chapter.id}
          >
            <Link href={`/dashboard/books/${params.id}/edit/${chapter.id}/editor`}>
              <div className="flex flex-col justify-evenly cursor-pointer">
                <h2>{chapter.chapterTitle}</h2>
                <h2>{chapter.chapterDescription}</h2>
              </div>
            </Link>
            <DragHandleDots1Icon className="h-8 w-8 cursor-grab" />
          </div>
        ))}
      </div>
    </div>
  );
}
