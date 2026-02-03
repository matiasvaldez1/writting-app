"use client";

import { useState, useTransition } from "react";
import { Link2Icon, ClipboardCopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toggleBookPublicAction } from "@/app/_actions/books";
import { useToast } from "@/components/ui/use-toast";

export default function ShareToggle({
  bookId,
  initialIsPublic,
  initialSlug,
}: {
  bookId: number;
  initialIsPublic: boolean;
  initialSlug: string | null;
}) {
  const t = useTranslations("editBook");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [slug, setSlug] = useState(initialSlug);
  const [copied, setCopied] = useState(false);

  const publicUrl = slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/read/${slug}`
    : "";

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleBookPublicAction(bookId);
      setIsPublic(result.isPublic);
      setSlug(result.publicSlug);
    });
  };

  const handleCopy = async () => {
    if (!publicUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({ url: publicUrl });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast({ title: t("linkCopied") });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-4">
      <div className="flex items-center gap-3">
        <Link2Icon className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="share-toggle" className="text-sm font-medium">
          {t("shareToggleLabel")}
        </Label>
        <Switch
          id="share-toggle"
          checked={isPublic}
          onCheckedChange={handleToggle}
          disabled={isPending}
          className="ml-auto"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {isPublic ? t("shareToggleOn") : t("shareToggleOff")}
      </p>
      {isPublic && slug && (
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded bg-muted px-2 py-1 text-xs">
            {publicUrl}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-emerald-500" />
            ) : (
              <ClipboardCopyIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
