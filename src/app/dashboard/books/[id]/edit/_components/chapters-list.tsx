"use client";

import { getUserBookAndChapters } from "@/app/_actions/books";
import EditableChaptersFields from "./editable-chapter-fields";
import Link from "next/link";
import { DragHandleDots1Icon } from "@radix-ui/react-icons";
import { AsyncReturnType } from "@/types/types";
import { Draggable, Droppable, DragDropContext } from "@hello-pangea/dnd";
import { useTransition } from "react";
import { swapChaptersAction } from "@/app/_actions/chapters";

export default function ChaptersList({
  bookAndChapters,
  bookId,
}: {
  bookAndChapters: AsyncReturnType<
    typeof getUserBookAndChapters
  >["bookAndChapters"];
  bookId: number;
}) {
  const [, startTransition] = useTransition();

  const onDragEnd = async (result: any) => {
    const sourceChapterId = result.draggableId;
    const destinationChapterId =
      bookAndChapters.chapters[result.destination.index as any].chapterNumber;
    startTransition(async () => {
      await swapChaptersAction(
        bookId,
        Number(sourceChapterId),
        destinationChapterId
      );
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(droppableProvided) => {
          return (
            <ul
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 "
            >
              {bookAndChapters.chapters.map((chapter, idx) => (
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
                          <button {...provided.dragHandleProps}>
                            <DragHandleDots1Icon className="h-8 w-8 cursor-grab" />
                          </button>
                        </div>
                      </Link>
                    </li>
                  )}
                </Draggable>
              ))}
            </ul>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
}


/* 
 const [optimisticState, swapOptimistic] = useOptimistic(
    bookAndChapters.chapters,
    (
      state,
      {
        sourceChapterNumber,
        destinationChapterNumber,
      }: { sourceChapterNumber: number; destinationChapterNumber: number }
    ) => {
      const sourceChapterNumberIndex = state.findIndex(
        (chapter) => chapter.chapterNumber === sourceChapterNumber
      );
      const destinationChapterNumberIndex = state.findIndex(
        (chapter) => chapter.chapterNumber === destinationChapterNumber
      );
      const newState = [...state];
      console.log(
        state[destinationChapterNumberIndex], 
        state[sourceChapterNumberIndex]
      );
      newState[sourceChapterNumberIndex] = state[destinationChapterNumberIndex];
      newState[destinationChapterNumberIndex] = state[sourceChapterNumberIndex];
      console.log("STATE AFTER", newState);

      return newState;
    }
  ); */
