import {
  getUserTags,
  createTag,
  updateTag,
  deleteTag,
} from "@/data-access/tags";

export async function getUserTagsUseCase({ userId }: { userId: number }) {
  if (!userId) throw new Error("No userId attached");
  return getUserTags({ userId });
}

export async function createTagUseCase({
  userId,
  name,
  color,
}: {
  userId: number;
  name: string;
  color: string;
}) {
  if (!userId) throw new Error("No userId attached");
  if (!name) throw new Error("No name attached");
  if (!color) throw new Error("No color attached");
  return createTag({ userId, name, color });
}

export async function updateTagUseCase({
  tagId,
  userId,
  name,
  color,
}: {
  tagId: number;
  userId: number;
  name: string;
  color: string;
}) {
  if (!tagId) throw new Error("No tagId attached");
  if (!userId) throw new Error("No userId attached");
  return updateTag({ tagId, userId, name, color });
}

export async function deleteTagUseCase({
  tagId,
  userId,
}: {
  tagId: number;
  userId: number;
}) {
  if (!tagId) throw new Error("No tagId attached");
  if (!userId) throw new Error("No userId attached");
  return deleteTag({ tagId, userId });
}
