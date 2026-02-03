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
  bookName: z.string().min(3).max(200),
  bookDescription: z.string().min(10).max(2000),
  amountOfChapters: z.number().min(1).max(200),
});
