import z from "zod";

export const booksZodSchema = z.object({
  userId: z.number(),
  bookName: z
    .string()
    .min(3, "The bookname must be longer")
    .max(200, "Book name is too long"),
  bookDescription: z
    .string()
    .min(10, "The description must be longer")
    .max(2000, "Description is too long"),
  amountOfChapters: z
    .number()
    .min(1, "Must have at least 1 chapter")
    .max(200, "Too many chapters"),
});
