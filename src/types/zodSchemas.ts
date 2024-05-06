import z from "zod";

export const booksZodSchema = z.object({
    userId: z.number(),
    bookName: z.string(),
    bookDescription: z.string(),
    amountOfChapters: z.number().nullable(),
  });
