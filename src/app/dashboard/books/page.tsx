export const dynamic = "force-dynamic";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserBooks } from "@/app/_actions/books";
import CreateBookDialog from "./_components/create-book-dialog";

export default async function Books() {
  const { books } = await getUserBooks();

  return (
    <div>
      <div className="flex w-full justify-between">
        <h2 className="text-2xl">Your books</h2>
        <CreateBookDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Book name</TableHead>
            <TableHead>Book description</TableHead>
            <TableHead>Amount of chapters</TableHead>
            <TableHead className="text-right">Id</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.bookName}</TableCell>
              <TableCell className="font-medium">
                {book.bookDescription}
              </TableCell>
              <TableCell className="font-medium">
                {book.amountOfChapters}
              </TableCell>
              <TableCell className="font-medium">{book.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
