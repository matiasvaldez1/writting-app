export const dynamic = "force-dynamic";

import { getUserBookAndChapters } from "@/app/_actions/books";
import PageHeading from "@/components/ui/page-header";
import { DragHandleDots1Icon } from "@radix-ui/react-icons";
import EditableChaptersFields from "./_components/editable-chapter-fields";
import Link from "next/link";

export default async function EditBook({ params }: { params: { id: string } }) {
  const { bookAndChapters } = await getUserBookAndChapters(Number(params.id));

  return (
    <div>
      <PageHeading title={`Edit book - ${bookAndChapters.bookName}`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        {bookAndChapters.chapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/dashboard/books/${params.id}/edit/${chapter.id}/editor`}
          >
            <div
              className="flex justify-between border border-gray-100 p-5 rounded"
            >
              <EditableChaptersFields
                bookId={Number(params.id)}
                chapter={chapter}
              />
              <DragHandleDots1Icon className="h-8 w-8 cursor-grab" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
