import { RocketIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NothingToSeeYet() {
  return (
    <Alert className="flex justify-between p-8">
      <div className="flex gap-2">
        <RocketIcon className="h-5 w-5" />
        <div className="flex-col">
          <AlertTitle className="font-bold">
            Welcome to the ultimate Writting App!
          </AlertTitle>
          <AlertDescription>
            You are all set up. Start writting and see your analytics in this
            page!
          </AlertDescription>
        </div>
      </div>
      <Link href={"/dashboard/books"}>
        <Button>Begin writting!</Button>
      </Link>
    </Alert>
  );
}
