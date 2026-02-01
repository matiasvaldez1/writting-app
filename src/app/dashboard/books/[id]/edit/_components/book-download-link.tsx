import { PDFDownloadLink } from "@react-pdf/renderer";
import { useTranslations } from "next-intl";
import type { BooksAndChapters } from "@/types/types";
import { Button } from "@/components/ui/button";
import PdfDocumentFromBook from "./book-pdf-document";

export default function PreviewLinkDownload({
  bookAndChapters,
}: {
  bookAndChapters: BooksAndChapters;
}) {
  const t = useTranslations("editBook");
  return (
    <Button variant={"link"}>
      <PDFDownloadLink
        document={<PdfDocumentFromBook bookAndChapters={bookAndChapters} />}
        fileName={`${bookAndChapters.bookName ?? "mybook"}.pdf`}
      >
        {({ loading }) => (loading ? t("loading") : t("download"))}
      </PDFDownloadLink>
    </Button>
  );
}
