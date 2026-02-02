import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ModeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";
import { Button } from "@/components/ui/button";
import { EMPTY_STRING } from "@/lib/constants";
import { capitalizeUsername } from "@/lib/utils";

export default async function Header() {
  const user = await currentUser();
  const t = await getTranslations("common");
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex justify-between items-center px-4 md:px-6 py-3">
        <div>
          <SignedIn>
            <Link href={"/dashboard"}>
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                Escribí
              </span>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href={"/"}>
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                Escribí
              </span>
            </Link>
          </SignedOut>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="hidden sm:inline-flex">
            <LocaleToggle />
          </span>
          <ModeToggle />
          <SignedIn>
            <div className="flex items-center gap-2">
              <UserButton />
              <span className="text-muted-foreground hidden sm:inline">
                {capitalizeUsername(user?.fullName ?? EMPTY_STRING)}
              </span>
            </div>
          </SignedIn>
          <SignedOut>
            <Link href={"/sign-in"}>
              <Button variant="link">{t("signIn")}</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
