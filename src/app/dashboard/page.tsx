import { getTranslations } from "next-intl/server";
import PageHeading from "@/components/ui/page-header";
import { estimatePageCount } from "@/lib/page-count";
import {
  getAllUserChapterTextsAction,
  getUserAnalyticsAction,
  getUserBooks,
} from "../_actions/books";
import { SessionDurationChart } from "../_components/dashboard-charts";
import { NothingToSeeYet } from "../_components/nothing-to-see-yet";

export default async function Dashboard() {
  const [{ userAnalytics }, { books }, { texts: chapterTexts }] =
    await Promise.all([
      getUserAnalyticsAction(),
      getUserBooks(),
      getAllUserChapterTextsAction(),
    ]);
  const t = await getTranslations("dashboard");

  if (userAnalytics.length === 0) {
    return <NothingToSeeYet />;
  }

  const totalBooks = books.length;
  const totalChapters = books.reduce(
    (sum, book) => sum + (book.amountOfChapters ?? 0),
    0
  );
  const sessions = userAnalytics.filter((a) => a.type === "sessionDuration");
  const totalMinutes = Math.round(
    sessions.reduce((sum, a) => sum + a.value, 0) / 60
  );
  const totalPages = chapterTexts.reduce(
    (sum, text) => sum + estimatePageCount(text),
    0
  );

  const stats = [
    { label: t("stats.totalBooks"), value: totalBooks },
    { label: t("stats.totalChapters"), value: totalChapters },
    { label: t("stats.totalPages"), value: totalPages },
    { label: t("stats.writingSessions"), value: sessions.length },
    {
      label: t("stats.totalWritingTime"),
      value: t("stats.minutes", { count: totalMinutes }),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title={t("title")} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <SessionDurationChart userAnalytics={userAnalytics} />
    </div>
  );
}
