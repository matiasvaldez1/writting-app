"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";
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
import { useToast } from "@/components/ui/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("createBook");

  return (
    <Button type="submit" disabled={pending}>
      {pending ? t("saving") : t("save")}
    </Button>
  );
}

export default function CreateBookDialog() {
  const t = useTranslations("createBook");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [amountOfChaptersIsKnown, setAmountOfChaptersIsKnown] = useState(false);
  const [state, action] = useFormState(createBookAction, {
    status: "",
  });

  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: t("bookCreated"),
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
        {t("trigger")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="my-5">{t("title")}</DialogTitle>
          <form action={action} className="flex flex-col gap-8 my-16">
            <Label htmlFor="bookName" className="text-base">
              {t("bookName")}
            </Label>
            <Input id="bookName" name="bookName" type="text" />
            {state?.bookName && (
              <span className="text-red-500">{state.bookName}</span>
            )}
            <Label htmlFor="bookDescription" className="text-base">
              {t("bookDescription")}
            </Label>
            <Input id="bookDescription" name="bookDescription" type="text" />
            {state?.bookDescription && (
              <span className="text-red-500">{state.bookDescription}</span>
            )}
            <Label htmlFor="amountOfChaptersIsKnown" className="text-base">
              {t("chaptersQuestion")} &nbsp;
            </Label>
            <Checkbox
              id="amountOfChaptersIsKnown"
              name="amountOfChaptersIsKnown"
              onClick={() => setAmountOfChaptersIsKnown((prev) => !prev)}
            />
            {amountOfChaptersIsKnown && (
              <>
                <Label htmlFor="amountOfChapters" className="text-base">
                  {t("amountOfChapters")}
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
