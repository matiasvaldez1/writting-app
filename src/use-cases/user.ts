import { getUserByClerkId } from "@/data-access/user";
import { currentUser } from "@clerk/nextjs/server";

export async function getUserByClerkIdUseCase() {
  const currentUserResponse = await currentUser();
  if (!currentUserResponse?.id) {
    throw new Error("Not user id found");
  }
  const user = await getUserByClerkId({ clerkId: currentUserResponse?.id });

  return { ...user, userId: user?.id };
}
