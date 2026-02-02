"use client";

import { useTranslations } from "next-intl";
import useOnlineStatus from "@/hooks/use-online-status";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const t = useTranslations("dashboard");

  if (isOnline) return null;

  return (
    <div className="bg-amber-500 text-white text-center text-sm py-1.5 px-4">
      {t("offlineBanner")}
    </div>
  );
}
