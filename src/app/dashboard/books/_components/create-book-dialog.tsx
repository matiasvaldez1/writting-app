"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBookAction } from "@/app/_actions/books";
import { useFormState, useFormStatus } from "react-dom";
import { useToast } from "@/components/ui/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

export default function CreateBookDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [amountOfChaptersIsKnown, setAmountOfChaptersIsKnown] = useState(false);
  const [state, action] = useFormState(createBookAction, {
    status: "",
  });

  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: "Book created",
      });
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  return (
    <Dialog open={open}>
      <DialogTrigger
        onClick={() => setOpen((prev) => !prev)}
        className="border border-gray-800 rounded-md p-3"
      >
        Create new book
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="my-5">Create book</DialogTitle>
          <form action={action} className="flex flex-col gap-8 my-16">
            <Label htmlFor="bookName" className="text-base">
              Book name
            </Label>
            <Input id="bookName" name="bookName" type="text" />
            {state?.bookName && (
              <span className="text-red-500">{state.bookName}</span>
            )}
            <Label htmlFor="bookDescription" className="text-base">
              Book description
            </Label>
            <Input id="bookDescription" name="bookDescription" type="text" />
            {state?.bookDescription && (
              <span className="text-red-500">{state.bookDescription}</span>
            )}
            <Label htmlFor="amountOfChaptersIsKnown" className="text-base">
              Do you know how many chapters will your book have? &nbsp;
            </Label>
            <Checkbox
              id="amountOfChaptersIsKnown"
              name="amountOfChaptersIsKnown"
              onClick={() => setAmountOfChaptersIsKnown((prev) => !prev)}
            />
            {amountOfChaptersIsKnown && (
              <>
                <Label htmlFor="amountOfChapters" className="text-base">
                  Amount of chapters
                </Label>
                <Input
                  id="amountOfChapters"
                  name="amountOfChapters"
                  type="number"
                  defaultValue={""}
                />
              </>
            )}
            <SubmitButton />
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
