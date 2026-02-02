import { openDB, type DBSchema, type IDBPDatabase } from "idb";

interface WritingAppDB extends DBSchema {
  drafts: {
    key: string;
    value: {
      key: string; // "bookId-chapterId"
      bookId: number;
      chapterId: number;
      content: string;
      updatedAt: number;
      synced: number; // 0 = unsynced, 1 = synced
    };
    indexes: {
      "by-synced": number;
      "by-updated": number;
    };
  };
  pendingActions: {
    key: number;
    value: {
      id?: number;
      action: "saveChapter";
      payload: {
        bookId: number;
        chapterId: number;
        content: string;
      };
      createdAt: number;
      retries: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<WritingAppDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<WritingAppDB>("writing-app", 1, {
      upgrade(db) {
        const draftsStore = db.createObjectStore("drafts", { keyPath: "key" });
        draftsStore.createIndex("by-synced", "synced");
        draftsStore.createIndex("by-updated", "updatedAt");

        db.createObjectStore("pendingActions", {
          keyPath: "id",
          autoIncrement: true,
        });
      },
    });
  }
  return dbPromise;
}

export type { WritingAppDB };
