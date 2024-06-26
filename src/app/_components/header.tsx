import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { EMPTY_STRING } from "@/lib/constants";
import { capitalizeUsername } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
  const user = await currentUser();
  return (
    <div className="flex justify-between p-8">
      <div>
        <SignedIn>
          <Link href={"/dashboard"}>
            <Image
              src={"/writter-app-logo.png"}
              alt="Writter app logo"
              width={200}
              height={50}
            />
          </Link>
        </SignedIn>
        <SignedOut>
          <Link href={"/"}>
            <Image
              src={"/writter-app-logo.png"}
              alt="Writter app logo"
              width={200}
              height={50}
            />
          </Link>
        </SignedOut>
      </div>
      <div className="flex gap-8">
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
            <Button variant="link">Sign in</Button>
          </Link>
        </SignedOut>
      </div>
    </div>
  );
}
