import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export async function NothingToSeeYet() {
  const t = await getTranslations("dashboard.welcome");
  return (
    <Alert className="flex justify-between p-8">
      <div className="flex gap-2">
        <RocketIcon className="h-5 w-5" />
        <div className="flex-col">
          <AlertTitle className="font-bold">{t("title")}</AlertTitle>
          <AlertDescription>{t("description")}</AlertDescription>
        </div>
      </div>
      <Link href={"/dashboard/books"}>
        <Button>{t("cta")}</Button>
      </Link>
    </Alert>
  );
}
