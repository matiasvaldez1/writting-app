import { Button } from "@/components/ui/button";
import { HomeIcon, ReaderIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Writter App Dashboard",
  description: "You can see your writting stats here",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex p-12 gap-6">
      <aside className="flex flex-col gap-10">
        <div>
          <Link href={"/dashboard"}>
            <Button className="text-xl" size={"lg"} variant="link">
              <HomeIcon className="h-4 w-4" /> &nbsp; Dashboard
            </Button>
          </Link>
        </div>
        <div>
          <Link href={"/dashboard/books"}>
            <Button className="text-xl" size={"lg"} variant="link">
              <ReaderIcon className="h-4 w-4" /> &nbsp; Books
            </Button>
          </Link>
        </div>
      </aside>
      <div className="w-full">{children}</div>
    </div>
  );
}
