import { db } from "@/drizzle/db";

export async function getUserByClerkId({ clerkId }: { clerkId: string }) {
  const user = await db.query.UsersTable.findFirst({
    where: (users, { eq }) => eq(users.clerkId, clerkId),
  });

  return user;
}
