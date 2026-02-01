import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <div className="flex flex-col text-center md:text-inherit md:flex-row md:justify-evenly p-8 md:p-16 lg:p-32">
      <div className="flex flex-col gap-8">
        <Link href={"/"}>
          <Button variant="link">{t("howItWorks")}</Button>
        </Link>
        <Link href={"/"}>
          <Button variant="link">{t("faq")}</Button>
        </Link>
        <Link href={"/"}>
          <Button variant="link">{t("contact")}</Button>
        </Link>
        <Link href={"/"}>
          <Button variant="link">{t("termsOfService")}</Button>
        </Link>
      </div>
      <div className="flex flex-col gap-8">
        <Link href={"/"}>
          <Button variant="link">{t("privacyPolicy")}</Button>
        </Link>
        <Link href={"/"}>
          <Button variant="link">{t("about")}</Button>
        </Link>
      </div>
    </div>
  );
}
