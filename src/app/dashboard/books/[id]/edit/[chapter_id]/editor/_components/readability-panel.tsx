"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { BarChartIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length === 0) return 0;

  let count = 0;
  let prevVowel = false;

  for (let i = 0; i < w.length; i++) {
    const isVowel = "aeiouy".includes(w[i]);
    if (isVowel && !prevVowel) count++;
    prevVowel = isVowel;
  }

  if (w.length > 3 && w.endsWith("e")) count--;

  return Math.max(1, count);
}

function analyzeText(text: string) {
  const words = text
    .split(/\s+/)
    .filter((w) => w.replace(/[^a-zA-Z0-9]/g, "").length > 0);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const charCount = words.join("").replace(/[^a-zA-Z0-9]/g, "").length;

  let totalSyllables = 0;
  let complexWordCount = 0;

  for (const word of words) {
    const syllables = countSyllables(word);
    totalSyllables += syllables;
    if (syllables >= 3) complexWordCount++;
  }

  const avgSentenceLength = wordCount / sentenceCount;
  const avgWordLength = wordCount > 0 ? charCount / wordCount : 0;
  const syllablesPerWord = wordCount > 0 ? totalSyllables / wordCount : 0;
  const complexWordsPercent =
    wordCount > 0 ? (complexWordCount / wordCount) * 100 : 0;

  const gradeLevel =
    wordCount > 0
      ? 0.39 * avgSentenceLength + 11.8 * syllablesPerWord - 15.59
      : 0;

  return {
    gradeLevel: Math.max(0, gradeLevel),
    avgSentenceLength,
    avgWordLength,
    complexWordsPercent,
    sentenceCount,
    totalSyllables,
  };
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}

export default function ReadabilityPanel({ text }: { text: string }) {
  const t = useTranslations("readability");

  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          title={t("title")}
          className={cn(
            "p-2 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          )}
        >
          <BarChartIcon className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-3">
        <p className="text-sm font-semibold mb-2">{t("title")}</p>
        <Separator className="mb-1" />
        <StatRow label={t("gradeLevel")} value={stats.gradeLevel.toFixed(1)} />
        <StatRow
          label={t("avgSentenceLength")}
          value={stats.avgSentenceLength.toFixed(1)}
        />
        <StatRow
          label={t("avgWordLength")}
          value={stats.avgWordLength.toFixed(1)}
        />
        <StatRow
          label={t("complexWords")}
          value={`${stats.complexWordsPercent.toFixed(1)}%`}
        />
        <Separator className="my-1" />
        <StatRow label={t("sentences")} value={String(stats.sentenceCount)} />
        <StatRow label={t("syllables")} value={String(stats.totalSyllables)} />
      </PopoverContent>
    </Popover>
  );
}
