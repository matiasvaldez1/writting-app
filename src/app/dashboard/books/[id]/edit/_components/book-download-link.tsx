import { PDFDownloadLink } from "@react-pdf/renderer";
import { BooksAndChapters } from "@/types/types";
import PdfDocumentFromBook from "./book-pdf-document";
import { Button } from "@/components/ui/button";

export default function PreviewLinkDownload({
  bookAndChapters,
}: {
  bookAndChapters: BooksAndChapters;
}) {
  return (
    <Button variant={"link"}>
      <PDFDownloadLink
        document={<PdfDocumentFromBook bookAndChapters={bookAndChapters} />}
        fileName={`${bookAndChapters.bookName ?? "mybook"}.pdf`}
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download now!"
        }
      </PDFDownloadLink>
    </Button>
  );
}
