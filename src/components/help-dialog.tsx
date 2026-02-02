"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const STORAGE_KEY = "hasSeenOnboarding";

export function HelpDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations("help");
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange! : setInternalOpen;

  useEffect(() => {
    if (isControlled) return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setInternalOpen(true);
      localStorage.setItem(STORAGE_KEY, "true");
    }
  }, [isControlled]);

  const shortcuts = [
    { key: "Ctrl+B", label: t("bold") },
    { key: "Ctrl+I", label: t("italic") },
    { key: "Ctrl+U", label: t("underline") },
    { key: "Ctrl+Z", label: t("undo") },
    { key: "Ctrl+Shift+Z", label: t("redo") },
    { key: "Ctrl+S", label: t("save") },
    { key: "Ctrl+Shift+Space", label: t("aiContinueShortcut") },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <section>
            <h3 className="font-semibold mb-1">{t("writingBasics")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("writingBasicsContent")}
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold mb-2">{t("keyboardShortcuts")}</h3>
            <div className="grid grid-cols-2 gap-1 text-sm">
              {shortcuts.map((s) => (
                <div key={s.key} className="contents">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs w-fit">
                    {s.key}
                  </kbd>
                  <span className="text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold mb-1">{t("chapterManagement")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("chapterManagementContent")}
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold mb-1">{t("pdfExport")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("pdfExportContent")}
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold mb-1">{t("aiWriting")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("aiWritingContent")}
            </p>
          </section>

          <Button onClick={() => onOpenChange(false)} className="mt-2">
            {t("gotIt")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
