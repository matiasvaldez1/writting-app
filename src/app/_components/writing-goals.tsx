"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateDailyWordGoalAction } from "@/app/_actions/books";

export function WritingGoals({
  dailyGoal,
  todayWords,
  streakDays,
}: {
  dailyGoal: number;
  todayWords: number;
  streakDays: number;
}) {
  const t = useTranslations("dashboard.goals");
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [goalInput, setGoalInput] = useState(String(dailyGoal || ""));

  const progress =
    dailyGoal > 0 ? Math.min((todayWords / dailyGoal) * 100, 100) : 0;
  const goalReached = dailyGoal > 0 && todayWords >= dailyGoal;

  const handleSaveGoal = () => {
    const newGoal = parseInt(goalInput) || 0;
    startTransition(async () => {
      await updateDailyWordGoalAction(newGoal);
      setEditing(false);
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{t("title")}</h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("setGoal")}
          </button>
        )}
      </div>

      {editing ? (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="500"
            className="h-8 w-24"
            min={0}
          />
          <span className="text-sm text-muted-foreground">
            {t("wordsPerDay")}
          </span>
          <Button
            size="sm"
            onClick={handleSaveGoal}
            disabled={isPending}
            className="ml-auto"
          >
            {t("save")}
          </Button>
        </div>
      ) : dailyGoal > 0 ? (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">
                {t("todayProgress")}
              </span>
              <span
                className={
                  goalReached
                    ? "text-emerald-500 font-medium"
                    : "text-muted-foreground"
                }
              >
                {goalReached
                  ? t("goalReached")
                  : t("wordsWritten", { count: todayWords, goal: dailyGoal })}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {streakDays > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t("streak")}</span>
              <span className="font-semibold">
                {t("streakDays", { count: streakDays })}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("noGoalSet")}</p>
      )}
    </div>
  );
}
