import PageHeading from "@/components/ui/page-header";
import Tiptap from "@/components/ui/tip-tap";

export default async function EditBook({ params }: { params: { id: string } }) {
  return (
    <div>
      <PageHeading title="Edit chapter" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        <Tiptap content="Test" />
      </div>
    </div>
  );
}