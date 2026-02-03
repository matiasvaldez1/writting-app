import { and, eq, asc } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { TagsTable, BookTagsTable } from "@/drizzle/schema";

export async function getUserTags({ userId }: { userId: number }) {
  return db
    .select({
      id: TagsTable.id,
      name: TagsTable.name,
      color: TagsTable.color,
      createdAt: TagsTable.createdAt,
    })
    .from(TagsTable)
    .where(eq(TagsTable.userId, userId))
    .orderBy(asc(TagsTable.name));
}

export async function createTag({
  userId,
  name,
  color,
}: {
  userId: number;
  name: string;
  color: string;
}) {
  const [tag] = await db
    .insert(TagsTable)
    .values({ userId, name, color })
    .returning();
  return tag;
}

export async function updateTag({
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
  const [updated] = await db
    .update(TagsTable)
    .set({ name, color })
    .where(and(eq(TagsTable.id, tagId), eq(TagsTable.userId, userId)))
    .returning();
  return updated;
}

export async function deleteTag({
  tagId,
  userId,
}: {
  tagId: number;
  userId: number;
}) {
  const [deleted] = await db
    .delete(TagsTable)
    .where(and(eq(TagsTable.id, tagId), eq(TagsTable.userId, userId)))
    .returning();
  return deleted;
}

export async function getBookTags({ bookId }: { bookId: number }) {
  return db
    .select({
      id: TagsTable.id,
      name: TagsTable.name,
      color: TagsTable.color,
    })
    .from(BookTagsTable)
    .innerJoin(TagsTable, eq(BookTagsTable.tagId, TagsTable.id))
    .where(eq(BookTagsTable.bookId, bookId))
    .orderBy(asc(TagsTable.name));
}

export async function setBookTags({
  bookId,
  tagIds,
}: {
  bookId: number;
  tagIds: number[];
}) {
  await db.delete(BookTagsTable).where(eq(BookTagsTable.bookId, bookId));

  if (tagIds.length > 0) {
    await db
      .insert(BookTagsTable)
      .values(tagIds.map((tagId) => ({ bookId, tagId })));
  }
}

export async function getTagsForBooks({ bookIds }: { bookIds: number[] }) {
  if (bookIds.length === 0) return {};

  const rows = await db
    .select({
      bookId: BookTagsTable.bookId,
      tagId: TagsTable.id,
      tagName: TagsTable.name,
      tagColor: TagsTable.color,
    })
    .from(BookTagsTable)
    .innerJoin(TagsTable, eq(BookTagsTable.tagId, TagsTable.id))
    .orderBy(asc(TagsTable.name));

  const map: Record<number, { id: number; name: string; color: string }[]> = {};
  for (const row of rows) {
    if (!bookIds.includes(row.bookId)) continue;
    if (!map[row.bookId]) map[row.bookId] = [];
    map[row.bookId].push({
      id: row.tagId,
      name: row.tagName,
      color: row.tagColor,
    });
  }
  return map;
}
