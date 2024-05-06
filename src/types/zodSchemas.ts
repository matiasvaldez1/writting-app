import z from "zod";

export const booksZodSchema = z.object({
  userId: z.number(),
  bookName: z.string().min(3, "The bookname must be longer"),
  bookDescription: z.string().min(10, "The description must be longer"),
  amountOfChapters: z.number(),
});
