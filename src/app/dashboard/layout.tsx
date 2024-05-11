"use client";

import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  ReaderIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const defaulClosedPath = pathname.includes("editor");
  const [hasMounted, setHasMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    defaulClosedPath ? false : true
  );

  useEffect(() => {
    if (defaulClosedPath) {
      setHasMounted(true);
      setIsSidebarOpen(defaulClosedPath ? false : true);
      return;
    }
    const storedValue = localStorage.getItem("sidebarOpen");
    if (storedValue !== null) {
      setIsSidebarOpen(JSON.parse(storedValue));
    }
    setHasMounted(true);
  }, [defaulClosedPath]);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  if (!hasMounted) return <LoadingSpinner className="mx-auto mt-[30svh]" />;

  return (
    <div className="flex p-12 gap-6 min-h-[80svh]">
      {isSidebarOpen && (
        <aside className="flex flex-col gap-10 border border-l-0 border-t-0 border-b-0 border-gray-200 relative group transition duration-300 ease-in-out">
          <div>
            <Link className="p-4" href={"/dashboard"}>
              <Button className="text-xl" size={"lg"} variant="link">
                <HomeIcon className="h-4 w-4" /> &nbsp; Dashboard
              </Button>
            </Link>
          </div>
          <div>
            <Link className="p-4" href={"/dashboard/books"}>
              <Button className="text-xl" size={"lg"} variant="link">
                <ReaderIcon className="h-4 w-4" /> &nbsp; Books
              </Button>
            </Link>
          </div>
          <Button
            onClick={toggleSidebar}
            className="absolute right-[-10%] bottom-[50%] hidden group-hover:block rounded-full"
            variant={"outline"}
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </Button>
        </aside>
      )}
      {!isSidebarOpen && (
        <aside className="flex flex-col gap-10 border border-l-0 border-t-0 border-b-0 border-gray-200 relative group">
          <div>
            <Link href={"/dashboard"}>
              <Button className="text-xl" variant="link">
                <HomeIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div>
            <Link href={"/dashboard/books"}>
              <Button className="text-xl" variant="link">
                <ReaderIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Button
            onClick={toggleSidebar}
            className="absolute right-[-50%] bottom-[50%] hidden group-hover:block rounded-full"
            variant={"outline"}
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </Button>
        </aside>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
}
