"use server";

import { revalidatePath } from "next/cache";
import { tagZodSchema } from "@/types/zodSchemas";
import {
  getUserTagsUseCase,
  createTagUseCase,
  updateTagUseCase,
  deleteTagUseCase,
} from "@/use-cases/tags";
import { getUserByClerkIdUseCase } from "@/use-cases/user";

export async function getUserTagsAction() {
  const user = await getUserByClerkIdUseCase();
  const tags = await getUserTagsUseCase({ userId: user.id });
  return { status: "success" as const, tags };
}

export async function createTagAction(data: { name: string; color: string }) {
  const parsed = tagZodSchema.safeParse(data);
  if (!parsed.success) {
    return { status: "error" as const, error: parsed.error.message };
  }

  const user = await getUserByClerkIdUseCase();
  const tag = await createTagUseCase({
    userId: user.id,
    name: parsed.data.name,
    color: parsed.data.color,
  });
  revalidatePath("/dashboard/books");
  return { status: "success" as const, tag };
}

export async function updateTagAction(data: {
  tagId: number;
  name: string;
  color: string;
}) {
  const parsed = tagZodSchema.safeParse({ name: data.name, color: data.color });
  if (!parsed.success) {
    return { status: "error" as const, error: parsed.error.message };
  }

  const user = await getUserByClerkIdUseCase();
  const tag = await updateTagUseCase({
    tagId: data.tagId,
    userId: user.id,
    name: parsed.data.name,
    color: parsed.data.color,
  });
  revalidatePath("/dashboard/books");
  return { status: "success" as const, tag };
}

export async function deleteTagAction(tagId: number) {
  const user = await getUserByClerkIdUseCase();
  await deleteTagUseCase({ tagId, userId: user.id });
  revalidatePath("/dashboard/books");
  return { status: "success" as const };
}
