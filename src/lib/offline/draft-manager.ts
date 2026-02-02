import { getDB } from "./db";

function draftKey(bookId: number, chapterId: number) {
  return `${bookId}-${chapterId}`;
}

export async function saveDraftLocally(
  bookId: number,
  chapterId: number,
  content: string
) {
  const db = await getDB();
  await db.put("drafts", {
    key: draftKey(bookId, chapterId),
    bookId,
    chapterId,
    content,
    updatedAt: Date.now(),
    synced: 0,
  });
}

export async function loadLocalDraft(bookId: number, chapterId: number) {
  const db = await getDB();
  return db.get("drafts", draftKey(bookId, chapterId));
}

export async function markDraftSynced(bookId: number, chapterId: number) {
  const db = await getDB();
  const draft = await db.get("drafts", draftKey(bookId, chapterId));
  if (draft) {
    await db.put("drafts", { ...draft, synced: 1 });
  }
}

export async function getUnsyncedDrafts() {
  const db = await getDB();
  return db.getAllFromIndex("drafts", "by-synced", 0);
}

export async function deleteDraft(bookId: number, chapterId: number) {
  const db = await getDB();
  await db.delete("drafts", draftKey(bookId, chapterId));
}
