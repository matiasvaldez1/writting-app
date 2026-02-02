import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col text-center md:text-inherit md:flex-row md:justify-evenly">
        <div className="flex flex-col gap-3">
          <Link
            href={"/"}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("howItWorks")}
          </Link>
          <Link
            href={"/"}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("faq")}
          </Link>
          <Link
            href={"/"}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("contact")}
          </Link>
          <Link
            href={"/"}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("termsOfService")}
          </Link>
        </div>
        <div className="flex flex-col gap-3 mt-6 md:mt-0">
          <Link
            href={"/"}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("privacyPolicy")}
          </Link>
          <Link
            href={"/"}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("about")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
