"use client";

import {
  HomeIcon,
  ReaderIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import OfflineBanner from "@/components/offline-banner";

const navItems = [
  { href: "/dashboard", icon: HomeIcon, labelKey: "dashboard" as const },
  { href: "/dashboard/books", icon: ReaderIcon, labelKey: "books" as const },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const t = useTranslations("dashboard.sidebar");
  const isEditor = pathname.includes("editor");
  const [hasMounted, setHasMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isEditor);

  useEffect(() => {
    if (isEditor) {
      setHasMounted(true);
      setIsSidebarOpen(false);
      return;
    }
    const storedValue = localStorage.getItem("sidebarOpen");
    if (storedValue !== null) {
      setIsSidebarOpen(JSON.parse(storedValue));
    }
    setHasMounted(true);
  }, [isEditor]);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  if (!hasMounted) return <LoadingSpinner className="mx-auto mt-[30svh]" />;

  if (isEditor) {
    return (
      <div className="min-h-svh">
        <OfflineBanner />
        {children}
      </div>
    );
  }

  return (
    <>
      <OfflineBanner />
      <div className="flex min-h-[80svh]">
        <aside
          className={`hidden lg:flex flex-col bg-card border-r border-border transition-all duration-200 ${isSidebarOpen ? "w-56" : "w-14"}`}
        >
          <nav className="flex flex-col gap-1 p-2 flex-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isSidebarOpen && <span>{t(item.labelKey)}</span>}
                </span>
              </Link>
            ))}
          </nav>
          <div className="p-2 border-t border-border">
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="w-full flex justify-center"
            >
              {isSidebarOpen ? (
                <ChevronLeftIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </aside>
        <div className="flex-1 p-4 md:p-8 lg:p-12 pb-20 lg:pb-12">
          {children}
        </div>
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-sm font-medium transition-colors ${
                isActive(item.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{t(item.labelKey)}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
