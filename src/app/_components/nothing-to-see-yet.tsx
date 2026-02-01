import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function NothingToSeeYet() {
  const t = useTranslations("dashboard.welcome");
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
