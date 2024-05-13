import z from "zod";
import { booksZodSchema } from "./zodSchemas";
import { getUserBookAndChapters } from "@/app/_actions/books";

export type booksZodType = z.infer<typeof booksZodSchema>;

export type BooksAndChapters = AsyncReturnType<
  typeof getUserBookAndChapters
>["bookAndChapters"];

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
