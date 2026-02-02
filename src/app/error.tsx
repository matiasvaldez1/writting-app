"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center items-center min-h-[50svh]">
      <div className="flex flex-col gap-8 h-fit">
        <h2 className="text-2xl">{t("somethingWentWrong")}</h2>
        <Button
          variant={"secondary"}
          className="text-2xl"
          onClick={() => reset()}
        >
          {t("tryAgain")}
        </Button>
      </div>
    </div>
  );
}
