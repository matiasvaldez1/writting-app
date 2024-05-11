import z from "zod";
import { booksZodSchema } from "./zodSchemas";

export type booksZodType = z.infer<typeof booksZodSchema>;

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
    ...args: any
  ) => Promise<infer R>
    ? R
    : any;
