"use client"

import React from "react";
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
import { getUserByClerkIdUseCase } from "@/use-cases/user";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

export default function Books() {
  const [error, action] = useFormState(createBookAction, {});
  console.log("ERROR", error)
  return (
    <div>
      <div className="flex w-full justify-between">
        <h2 className="text-2xl">Your books</h2>
        <Dialog>
          <DialogTrigger className="border border-gray-800 rounded-md p-3">
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
                {error?.bookName && (
                  <span className="text-destructive">{error.bookName}</span>
                )}
                <Label htmlFor="bookDescription" className="text-base">
                  Book description
                </Label>
                <Input
                  id="bookDescription"
                  name="bookDescription"
                  type="text"
                />
                {error?.bookDescription && (
                  <span className="text-destructive">
                    {error.bookDescription}
                  </span>
                )}
                <Label htmlFor="amountOfChaptersIsKnown" className="text-base">
                  Do you know how many chapters will your book have? &nbsp;
                </Label>
                <Checkbox
                  id="amountOfChaptersIsKnown"
                  name="amountOfChaptersIsKnown"
                />
                <Label htmlFor="amountOfChapters" className="text-base">
                  Amount of chapters
                </Label>
                <Input
                  id="amountOfChapters"
                  name="amountOfChapters"
                  type="number"
                />
                <SubmitButton />
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
