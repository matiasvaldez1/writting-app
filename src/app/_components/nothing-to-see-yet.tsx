import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function NothingToSeeYet() {
  return (
    <Alert className="flex justify-between p-8">
      <div className="flex gap-2">
        <RocketIcon className="h-5 w-5" />
        <div className="flex-col">
          <AlertTitle className="font-bold">
            Welcome to the ultimate Writing App!
          </AlertTitle>
          <AlertDescription>
            You are all set up. Start writing and see your analytics on this
            page!
          </AlertDescription>
        </div>
      </div>
      <Link href={"/dashboard/books"}>
        <Button>Begin writing!</Button>
      </Link>
    </Alert>
  );
}
