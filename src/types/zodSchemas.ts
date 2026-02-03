import z from "zod";

export const bookStatusSchema = z.enum([
  "draft",
  "in_progress",
  "completed",
  "archived",
]);

export type BookStatus = z.infer<typeof bookStatusSchema>;

export const tagZodSchema = z.object({
  name: z.string().min(1).max(30),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

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
