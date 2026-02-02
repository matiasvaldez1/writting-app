"use client";

import { useEffect, useRef } from "react";
import { SyncQueue } from "@/lib/offline/sync-queue";
import { updateChapterTextContent } from "@/app/_actions/books";

export default function useSyncQueue() {
  const queueRef = useRef<SyncQueue | null>(null);

  useEffect(() => {
    const queue = new SyncQueue((bookId, chapterId, content) =>
      updateChapterTextContent(bookId, chapterId, content)
    );
    queue.start();
    queueRef.current = queue;

    return () => {
      queue.stop();
    };
  }, []);

  return queueRef;
}
