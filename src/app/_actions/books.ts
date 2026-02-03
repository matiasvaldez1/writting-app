"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import { getTranslations } from "next-intl/server";
import { getUserAnalytics } from "@/data-access/books";
import { booksZodSchema } from "@/types/zodSchemas";
import { templates } from "@/lib/templates";
import { bookStatusSchema } from "@/types/zodSchemas";
import type { BookStatus } from "@/types/zodSchemas";
import {
  addChapterUseCase,
  addWritingSessionUseCase,
  createBookUseCase,
  deleteBookUseCase,
  deleteChapterUseCase,
  getAllUserChapterTextsUseCase,
  getDailyWordGoalUseCase,
  getBookTagsUseCase,
  getUserBookAndChapterUseCase,
  getUserBookAndChaptersUseCase,
  getUserBooksUseCase,
  recordWordCountUseCase,
  setBookTagsUseCase,
  toggleBookPublicUseCase,
  updateBookMetadataUseCase,
  updateBookStatusUseCase,
  updateChapterDescriptionUseCase,
  updateChapterTextContentUseCase,
  updateChapterTitleUseCase,
  updateDailyWordGoalUseCase,
} from "@/use-cases/books";
import { getUserByClerkIdUseCase } from "@/use-cases/user";

const createBookActionSchema = booksZodSchema
  .extend({
    amountOfChapters: z.string().nullish(),
    status: bookStatusSchema.optional(),
    tagIds: z.string().optional(),
  })
  .omit({ userId: true });

type CreateBookState = {
  status: string;
  bookName?: string[];
  bookDescription?: string[];
  amountOfChapters?: string[];
};

export async function createBookAction(
  _param: CreateBookState,
  formData: FormData
): Promise<CreateBookState> {
  const result = createBookActionSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!result.success) {
    const t = await getTranslations("validation");
    const fieldErrors = result.error.formErrors.fieldErrors;
    const translated: Record<string, string[]> = {};
    const errorMap: Record<string, Record<string, string>> = {
      bookName: { too_small: t("bookNameMin"), too_big: t("bookNameMax") },
      bookDescription: {
        too_small: t("bookDescriptionMin"),
        too_big: t("bookDescriptionMax"),
      },
      amountOfChapters: {
        too_small: t("chaptersMin"),
        too_big: t("chaptersMax"),
      },
    };
    for (const [field, errors] of Object.entries(fieldErrors)) {
      const issuesForField = result.error.issues.filter(
        (i) => i.path[0] === field
      );
      translated[field] = issuesForField.map(
        (issue) => errorMap[field]?.[issue.code] ?? (errors?.[0] || "")
      );
    }
    return { ...translated, status: "error" };
  }

  const user = await getUserByClerkIdUseCase();
  const data = result.data;
  const templateId = formData.get("templateId") as string | null;
  const template = templateId
    ? templates.find((t) => t.id === templateId)
    : null;

  const book = await createBookUseCase({
    values: {
      ...data,
      userId: user.id,
      amountOfChapters: template
        ? template.documents.length
        : Number(data.amountOfChapters ?? 0),
    },
    initialDocuments: template?.documents,
  });

  if (data.status && data.status !== "draft") {
    await updateBookStatusUseCase({
      bookId: book.id,
      userId: user.id,
      status: data.status,
    });
  }

  if (data.tagIds) {
    try {
      const tagIds = JSON.parse(data.tagIds) as number[];
      if (tagIds.length > 0) {
        await setBookTagsUseCase({ bookId: book.id, userId: user.id, tagIds });
      }
    } catch {
      // ignore invalid tagIds
    }
  }

  revalidatePath("/dashboard/books");
  return { status: "success" };
}

export async function deleteBookAction(bookId: number) {
  const user = await getUserByClerkIdUseCase();
  const bookDeleted = await deleteBookUseCase({ bookId, userId: user.id });
  if (bookDeleted) {
    revalidatePath("/dashboard/books");
  }
}

export async function getUserBooks(params?: {
  search?: string;
  sort?: string;
  status?: string;
}) {
  const user = await getUserByClerkIdUseCase();
  const sort = (params?.sort || "newest") as
    | "newest"
    | "oldest"
    | "name"
    | "chapters";
  const statusParsed = bookStatusSchema.safeParse(params?.status);
  const books = await getUserBooksUseCase({
    userId: user.id,
    search: params?.search,
    sort,
    status: statusParsed.success ? statusParsed.data : undefined,
  });
  return { status: "success", books };
}

export async function getUserBookAndChapters(bookId: number) {
  const user = await getUserByClerkIdUseCase();
  const bookAndChapters = await getUserBookAndChaptersUseCase({
    bookId,
    userId: user.id,
  });
  return { status: "success", bookAndChapters };
}

export async function getUserBookAndChapter(bookId: number, chapterId: number) {
  const user = await getUserByClerkIdUseCase();
  const bookAndChapter = await getUserBookAndChapterUseCase({
    bookId,
    chapterId,
    userId: user.id,
  });
  return { status: "success", bookAndChapter };
}

export async function updateChapterTextContent(
  bookId: number,
  chapterId: number,
  newValue: string
) {
  const user = await getUserByClerkIdUseCase();
  const chapterUpdated = await updateChapterTextContentUseCase({
    bookId,
    chapterId,
    newTextContent: newValue,
    userId: user.id,
  });
  return { status: "success", chapterUpdated };
}

export async function updateChapterTitle(
  bookId: number,
  chapterId: number,
  newValue: string
) {
  const user = await getUserByClerkIdUseCase();
  const chapterUpdated = await updateChapterTitleUseCase({
    bookId,
    chapterId,
    newTextContent: newValue,
    userId: user.id,
  });
  revalidatePath(`/dashboard/books/${bookId}/edit`);
  return { status: "success", chapterUpdated };
}

export async function updateChapterDescription(
  bookId: number,
  chapterId: number,
  newValue: string
) {
  const user = await getUserByClerkIdUseCase();
  const chapterUpdated = await updateChapterDescriptionUseCase({
    bookId,
    chapterId,
    newTextContent: newValue,
    userId: user.id,
  });
  revalidatePath(`/dashboard/books/${bookId}/edit`);
  return { status: "success", chapterUpdated };
}

export async function addWritingSession(
  durationOfSessionInMilliseconds: number,
  bookId: number,
  chapterId: number
) {
  const user = await getUserByClerkIdUseCase();
  const writingSession = await addWritingSessionUseCase({
    userId: user.id,
    sessionTimeInMilliseconds: durationOfSessionInMilliseconds,
  });
  revalidatePath(`/dashboard/books/${bookId}/edit/${chapterId}/editor`);
  return { status: "success", writingSession };
}

export async function getAllUserChapterTextsAction() {
  const user = await getUserByClerkIdUseCase();
  const texts = await getAllUserChapterTextsUseCase({ userId: user.id });
  return { status: "success", texts };
}

export async function getUserAnalyticsAction() {
  const user = await getUserByClerkIdUseCase();
  try {
    const userAnalytics = await getUserAnalytics({ userId: user.id });
    revalidatePath("/dashboard");
    return { status: "success", userAnalytics };
  } catch (_) {
    return {
      status: "success",
      userAnalytics: [] as Awaited<ReturnType<typeof getUserAnalytics>>,
    };
  }
}

export async function addChapterAction(bookId: number) {
  const user = await getUserByClerkIdUseCase();
  const chapter = await addChapterUseCase({ bookId, userId: user.id });
  revalidatePath(`/dashboard/books/${bookId}/edit`);
  return { status: "success", chapter };
}

export async function deleteChapterAction(bookId: number, chapterId: number) {
  const user = await getUserByClerkIdUseCase();
  await deleteChapterUseCase({ bookId, chapterId, userId: user.id });
  revalidatePath(`/dashboard/books/${bookId}/edit`);
  return { status: "success" };
}

export async function updateBookMetadataAction(
  bookId: number,
  data: { bookName?: string; bookDescription?: string }
) {
  const user = await getUserByClerkIdUseCase();
  const updated = await updateBookMetadataUseCase({
    bookId,
    userId: user.id,
    ...data,
  });
  revalidatePath(`/dashboard/books/${bookId}/edit`);
  revalidatePath("/dashboard/books");
  return { status: "success", book: updated };
}

export async function recordWordCountAction(wordsDelta: number) {
  const user = await getUserByClerkIdUseCase();
  await recordWordCountUseCase({ userId: user.id, wordsDelta });
  return { status: "success" };
}

export async function updateDailyWordGoalAction(goal: number) {
  const user = await getUserByClerkIdUseCase();
  await updateDailyWordGoalUseCase({ userId: user.id, goal });
  revalidatePath("/dashboard");
  return { status: "success" };
}

export async function getDailyWordGoalAction() {
  const user = await getUserByClerkIdUseCase();
  const goal = await getDailyWordGoalUseCase({ userId: user.id });
  return { status: "success", goal };
}

export async function toggleBookPublicAction(bookId: number) {
  const user = await getUserByClerkIdUseCase();
  const updated = await toggleBookPublicUseCase({ bookId, userId: user.id });
  revalidatePath(`/dashboard/books/${bookId}/edit`);
  return {
    status: "success",
    isPublic: updated.isPublic,
    publicSlug: updated.publicSlug,
  };
}

export async function updateBookStatusAction(
  bookId: number,
  status: BookStatus
) {
  const user = await getUserByClerkIdUseCase();
  await updateBookStatusUseCase({ bookId, userId: user.id, status });
  revalidatePath(`/dashboard/books/${bookId}/edit`);
  revalidatePath("/dashboard/books");
  return { status: "success" };
}

export async function setBookTagsAction(bookId: number, tagIds: number[]) {
  const user = await getUserByClerkIdUseCase();
  await setBookTagsUseCase({ bookId, userId: user.id, tagIds });
  revalidatePath(`/dashboard/books/${bookId}/edit`);
  revalidatePath("/dashboard/books");
  return { status: "success" };
}

export async function getBookTagsAction(bookId: number) {
  const user = await getUserByClerkIdUseCase();
  const tags = await getBookTagsUseCase({ bookId, userId: user.id });
  return { status: "success", tags };
}
