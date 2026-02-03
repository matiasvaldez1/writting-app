"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookStatus } from "@/types/zodSchemas";

const STATUS_COLORS: Record<BookStatus, string> = {
  draft: "bg-gray-400",
  in_progress: "bg-blue-500",
  completed: "bg-green-500",
  archived: "bg-amber-500",
};

const STATUSES: BookStatus[] = [
  "draft",
  "in_progress",
  "completed",
  "archived",
];

export default function StatusSelect({
  value,
  onValueChange,
}: {
  value: BookStatus;
  onValueChange: (value: BookStatus) => void;
}) {
  const t = useTranslations("status");

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${STATUS_COLORS[s]}`} />
              {t(s)}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function StatusBadge({ status }: { status: BookStatus }) {
  const t = useTranslations("status");

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${STATUS_COLORS[status]}`} />
      {t(status)}
    </span>
  );
}

export function StatusFilter({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const t = useTranslations("status");

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder={t("all")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t("all")}</SelectItem>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${STATUS_COLORS[s]}`} />
              {t(s)}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
