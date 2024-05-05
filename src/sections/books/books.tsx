"use client";

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
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  bookName: Yup.string().required("Book name is required"),
  bookDescription: Yup.string().required("Book description is required"),
});

export default function BooksSection() {
  const formik = useFormik({
    initialValues: {
      bookName: "",
      bookDescription: "",
      amountOfChaptersIsKnown: false,
      amountOfChapters: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  console.log(formik.values);
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
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-8 my-16"
              >
                <Label htmlFor="bookName" className="text-base">
                  Book name
                </Label>
                <Input
                  id="bookName"
                  name="bookName"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.bookName}
                />
                {formik.touched.bookName && formik.errors.bookName ? (
                  <div className="text-red-600">{formik.errors.bookName}</div>
                ) : null}
                <Label htmlFor="bookDescription" className="text-base">
                  Book description
                </Label>
                <Input
                  id="bookDescription"
                  name="bookDescription"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.bookDescription}
                />
                {formik.touched.bookDescription &&
                formik.errors.bookDescription ? (
                  <div className="text-red-600">
                    {formik.errors.bookDescription}
                  </div>
                ) : null}
                <Label htmlFor="amountOfChaptersIsKnown" className="text-base">
                  Do you know how many chapters will your book have? &nbsp;
                </Label>
                <Checkbox
                  id="amountOfChaptersIsKnown"
                  name="amountOfChaptersIsKnown"
                  checked={formik.values.amountOfChaptersIsKnown}
                  onCheckedChange={(e) =>
                    formik.setFieldValue("amountOfChaptersIsKnown", e)
                  }
                />
                {formik.values.amountOfChaptersIsKnown && (
                  <>
                    <Label htmlFor="amountOfChapters" className="text-base">
                      Amount of chapters
                    </Label>
                    <Input
                      id="amountOfChapters"
                      name="amountOfChapters"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.amountOfChapters}
                    />
                  </>
                )}
                <Button type="submit">Create book</Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
