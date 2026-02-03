import { getTranslations } from "next-intl/server";
import PageHeading from "@/components/ui/page-header";
import { estimatePageCount } from "@/lib/page-count";
import {
  getAllUserChapterTextsAction,
  getDailyWordGoalAction,
  getUserAnalyticsAction,
  getUserBooks,
} from "../_actions/books";
import { SessionDurationChart } from "../_components/dashboard-charts";
import { NothingToSeeYet } from "../_components/nothing-to-see-yet";
import { WritingGoals } from "../_components/writing-goals";

function computeStreakAndToday(
  analytics: { type: string; value: number; createdAt: Date }[],
  goal: number
) {
  const wordEntries = analytics.filter((a) => a.type === "wordCount");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayWords = wordEntries
    .filter((a) => new Date(a.createdAt) >= today)
    .reduce((sum, a) => sum + a.value, 0);

  if (goal <= 0) return { todayWords, streakDays: 0 };

  const dailyTotals = new Map<string, number>();
  for (const entry of wordEntries) {
    const d = new Date(entry.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + entry.value);
  }

  let streak = 0;
  const check = new Date();
  check.setHours(0, 0, 0, 0);
  const todayKey = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
  if ((dailyTotals.get(todayKey) ?? 0) < goal) {
    check.setDate(check.getDate() - 1);
  }

  while (true) {
    const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
    if ((dailyTotals.get(key) ?? 0) >= goal) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }

  return { todayWords, streakDays: streak };
}

export default async function Dashboard() {
  const [{ userAnalytics }, { books }, { texts: chapterTexts }, { goal }] =
    await Promise.all([
      getUserAnalyticsAction(),
      getUserBooks(),
      getAllUserChapterTextsAction(),
      getDailyWordGoalAction(),
    ]);
  const t = await getTranslations("dashboard");

  if (userAnalytics.length === 0 && goal === 0) {
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

  const { todayWords, streakDays } = computeStreakAndToday(userAnalytics, goal);

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
      <WritingGoals
        dailyGoal={goal}
        todayWords={todayWords}
        streakDays={streakDays}
      />
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
