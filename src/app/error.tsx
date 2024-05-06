"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center items-center min-h-[50svh]">
      <div className="flex flex-col gap-8 h-fit">
        <h2 className="text-2xl">Something went wrong!</h2>
        <Button
          variant={"secondary"}
          className="text-2xl"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
