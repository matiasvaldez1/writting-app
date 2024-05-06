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

export default async function Books() {
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
              <form className="flex flex-col gap-8 my-16">
                <Label htmlFor="bookName" className="text-base">
                  Book name
                </Label>
                <Input id="bookName" name="bookName" type="text" />
                <Label htmlFor="bookDescription" className="text-base">
                  Book description
                </Label>
                <Input
                  id="bookDescription"
                  name="bookDescription"
                  type="text"
                />
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
                  type="text"
                />
                <Button type="submit">Create book</Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
