"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId, createUserFromClerk } from "@/data-access/user";

export async function getUserByClerkIdUseCase() {
  const currentUserResponse = await currentUser();
  if (!currentUserResponse?.id) {
    throw new Error("No user id found");
  }
  let user = await getUserByClerkId({ clerkId: currentUserResponse.id });
  if (!user) {
    const email = currentUserResponse.emailAddresses?.[0]?.emailAddress ?? "";
    const name =
      [currentUserResponse.firstName, currentUserResponse.lastName]
        .filter(Boolean)
        .join(" ") || "User";
    user = await createUserFromClerk({
      clerkId: currentUserResponse.id,
      email,
      name,
    });
  }

  return { ...user, userId: user.id };
}
