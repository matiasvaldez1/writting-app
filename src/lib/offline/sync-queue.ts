import { getUnsyncedDrafts, markDraftSynced } from "./draft-manager";

type SaveFn = (
  bookId: number,
  chapterId: number,
  content: string
) => Promise<unknown>;

export class SyncQueue {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private saveFn: SaveFn;

  constructor(saveFn: SaveFn) {
    this.saveFn = saveFn;
  }

  start() {
    this.intervalId = setInterval(() => this.processQueue(), 30000);
    window.addEventListener("online", this.handleOnline);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    window.removeEventListener("online", this.handleOnline);
  }

  private handleOnline = () => {
    this.processQueue();
  };

  async processQueue() {
    if (!navigator.onLine) return;

    const unsynced = await getUnsyncedDrafts();
    for (const draft of unsynced) {
      try {
        await this.saveFn(draft.bookId, draft.chapterId, draft.content);
        await markDraftSynced(draft.bookId, draft.chapterId);
      } catch {
        // Will retry on next interval
      }
    }
  }
}
