import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ModeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";
import { Button } from "@/components/ui/button";
import { EMPTY_STRING } from "@/lib/constants";
import { capitalizeUsername } from "@/lib/utils";

export default async function Header() {
  const user = await currentUser();
  const t = useTranslations("common");
  return (
    <div className="flex justify-between p-4 md:p-8">
      <div>
        <SignedIn>
          <Link href={"/dashboard"}>
            <Image
              src={"/writer-app-logo.png"}
              alt={t("logoAlt")}
              width={200}
              height={50}
              className="w-[120px] md:w-[200px]"
            />
          </Link>
        </SignedIn>
        <SignedOut>
          <Link href={"/"}>
            <Image
              src={"/writer-app-logo.png"}
              alt={t("logoAlt")}
              width={200}
              height={50}
              className="w-[120px] md:w-[200px]"
            />
          </Link>
        </SignedOut>
      </div>
      <div className="flex gap-2 md:gap-8">
        <LocaleToggle />
        <ModeToggle />
        <SignedIn>
          <div className="flex flex-col justify-center">
            <div className="m-auto">
              <UserButton />
            </div>
            {capitalizeUsername(user?.fullName ?? EMPTY_STRING)}
          </div>
        </SignedIn>
        <SignedOut>
          <Link href={"/sign-in"}>
            <Button variant="link">{t("signIn")}</Button>
          </Link>
        </SignedOut>
      </div>
    </div>
  );
}
