"use client";

import Link from "next/link";
import {
  DragHandleDots1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Draggable, Droppable, DragDropContext } from "@hello-pangea/dnd";
import { useOptimistic, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { AsyncReturnType } from "@/types/types";
import { addChapterAction, deleteChapterAction } from "@/app/_actions/books";
import type { getUserBookAndChapters } from "@/app/_actions/books";
import { swapChaptersAction } from "@/app/_actions/chapters";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import EditableChaptersFields from "./editable-chapter-fields";

export default function ChaptersList({
  bookAndChapters,
  bookId,
}: {
  bookAndChapters: AsyncReturnType<
    typeof getUserBookAndChapters
  >["bookAndChapters"];
  bookId: number;
}) {
  const t = useTranslations("editBook");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [optimisticState, swapOptimistic] = useOptimistic(
    bookAndChapters.chapters,
    (
      state,
      {
        sourceChapterNumber,
        destinationChapterNumber,
      }: { sourceChapterNumber: number; destinationChapterNumber: number }
    ) => {
      const sourceIdx = state.findIndex(
        (ch) => ch.chapterNumber === sourceChapterNumber
      );
      const destIdx = state.findIndex(
        (ch) => ch.chapterNumber === destinationChapterNumber
      );
      const newState = [...state];
      newState[sourceIdx] = state[destIdx];
      newState[destIdx] = state[sourceIdx];
      return newState;
    }
  );

  const onDragEnd = async (result: {
    draggableId: string;
    destination?: { index: number } | null;
  }) => {
    if (!result.destination) return;

    const sourceChapterNumber = Number(result.draggableId);
    const destinationChapterNumber =
      bookAndChapters.chapters[result.destination.index].chapterNumber;

    const sourceIdx = optimisticState.findIndex(
      (ch) => ch.chapterNumber === sourceChapterNumber
    );
    const destIdx = optimisticState.findIndex(
      (ch) => ch.chapterNumber === destinationChapterNumber
    );
    const newState = [...optimisticState];
    newState[sourceIdx] = optimisticState[destIdx];
    newState[destIdx] = optimisticState[sourceIdx];

    const idsOfNewOrder = newState.map((ch) => ch.id);

    startTransition(async () => {
      swapOptimistic({ sourceChapterNumber, destinationChapterNumber });
    });
    startTransition(async () => {
      await swapChaptersAction(bookId, idsOfNewOrder);
    });
  };

  const handleAddChapter = () => {
    startTransition(async () => {
      try {
        await addChapterAction(bookId);
        toast({ title: t("chapterAdded") });
      } catch {
        toast({ title: t("chapterAddFailed") });
      }
    });
  };

  const handleDeleteChapter = (chapterId: number) => {
    startTransition(async () => {
      try {
        await deleteChapterAction(bookId, chapterId);
        toast({ title: t("chapterDeleted") });
      } catch {
        toast({ title: t("chapterDeleteFailed") });
      }
    });
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
          {(droppableProvided) => (
            <ul
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className="grid grid-cols-1 gap-4"
            >
              {droppableProvided.placeholder}
              {optimisticState.map((chapter, idx) => (
                <Draggable
                  index={idx}
                  key={chapter.id}
                  draggableId={String(chapter.chapterNumber)}
                >
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps}>
                      <Link
                        href={`/dashboard/books/${bookId}/edit/${chapter.id}/editor`}
                      >
                        <div className="flex justify-between border border-gray-100 p-5 rounded">
                          <EditableChaptersFields
                            bookId={bookId}
                            chapter={chapter}
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteChapter(chapter.id);
                              }}
                              title={t("deleteChapter")}
                              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                            <button {...provided.dragHandleProps}>
                              <DragHandleDots1Icon className="h-8 w-8 cursor-grab" />
                            </button>
                          </div>
                        </div>
                      </Link>
                    </li>
                  )}
                </Draggable>
              ))}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        onClick={handleAddChapter}
        disabled={isPending}
        variant="outline"
        className="mt-4 w-full"
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        {t("addChapter")}
      </Button>
    </div>
  );
}
