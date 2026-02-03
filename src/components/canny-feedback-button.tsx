"use client";

import { useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

declare global {
  interface Window {
    Canny?: {
      (action: string, options?: Record<string, unknown>): void;
    };
  }
}

const BOARD_TOKEN = process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN;

export default function CannyFeedbackButton({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const { user } = useUser();
  const t = useTranslations("feedback");

  useEffect(() => {
    if (!BOARD_TOKEN) return;
    if (document.getElementById("canny-jssdk")) return;

    const script = document.createElement("script");
    script.id = "canny-jssdk";
    script.src = "https://canny.io/sdk.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const openCanny = useCallback(() => {
    if (!window.Canny || !BOARD_TOKEN) return;

    window.Canny("render", {
      boardToken: BOARD_TOKEN,
      basePath: null,
      ssoToken: null,
      theme: "auto",
      ...(user && {
        user: {
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName || user.firstName || "User",
          id: user.id,
          avatarURL: user.imageUrl,
        },
      }),
    });
  }, [user]);

  if (!BOARD_TOKEN) return null;

  return (
    <button
      onClick={openCanny}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent w-full ${
        collapsed ? "justify-center" : ""
      }`}
      title={t("tooltip")}
    >
      <ChatBubbleIcon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{t("button")}</span>}
    </button>
  );
}
