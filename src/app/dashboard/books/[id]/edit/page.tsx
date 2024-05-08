import PageHeading from "@/components/ui/page-header";

export default async function EditBook({ params }: { params: { id: string } }) {
  console.log(params);
  return (
    <div>
      <PageHeading title="Edit book" />
    </div>
  );
}
