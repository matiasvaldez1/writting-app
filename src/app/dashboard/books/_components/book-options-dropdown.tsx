"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBookAction } from "@/app/_actions/books";
import { useToast } from "@/components/ui/use-toast";

export default function BookOptionsDropdown({ bookId }: { bookId: number }) {
  const [, startTransition] = useTransition();
  const { toast } = useToast();
  const t = useTranslations("books");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DotsHorizontalIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={`/dashboard/books/${bookId}/edit`}>
          <DropdownMenuItem className="cursor-pointer">
            {t("edit")}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive"
          onClick={async () => {
            startTransition(() => {
              deleteBookAction(bookId)
                .then(() => {
                  toast({
                    title: t("bookDeleted"),
                    description: t("bookDeletedDescription"),
                  });
                })
                .catch((e) => {
                  toast({
                    title: t("somethingWentWrong"),
                    description: e.message,
                    variant: "destructive",
                  });
                });
            });
          }}
        >
          {t("deleteBook")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
