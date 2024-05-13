"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBookAction } from "@/app/_actions/books";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import Link from "next/link";

export default function BookOptionsDropdown({ bookId }: { bookId: number }) {
  const [, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DotsHorizontalIcon className="h-8 w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={`/dashboard/books/${bookId}/edit`}>
          <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-500"
          onClick={async () => {
            startTransition(() => {
              deleteBookAction(bookId)
                .then(() => {
                  toast({
                    title: "Book deleted",
                    description: "Your book has been removed",
                  });
                })
                .catch((e) => {
                  console.error("error", e);
                  toast({
                    title: "Something went wrong",
                    description: e.message,
                    variant: "destructive",
                  });
                });
            });
          }}
        >
          Delete book
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
