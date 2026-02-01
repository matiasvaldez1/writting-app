"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/data-access/user";

export async function getUserByClerkIdUseCase() {
  const currentUserResponse = await currentUser();
  if (!currentUserResponse?.id) {
    throw new Error("No user id found");
  }
  const user = await getUserByClerkId({ clerkId: currentUserResponse.id });
  if (!user) {
    throw new Error("User not found in database");
  }

  return { ...user, userId: user.id };
}
