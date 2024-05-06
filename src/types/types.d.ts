import z from "zod";
import { booksZodSchema } from "./zodSchemas";

export type booksZodType = z.infer<typeof booksZodSchema>;
