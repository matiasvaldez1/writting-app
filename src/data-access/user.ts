import { db } from "@/drizzle/db";
import { UsersTable } from "@/drizzle/schema";

export async function getUserByClerkId({ clerkId }: { clerkId: string }) {
  const user = await db.query.UsersTable.findFirst({
    where: (users, { eq }) => eq(users.clerkId, clerkId),
  });

  return user;
}

export async function createUserFromClerk({
  clerkId,
  email,
  name,
}: {
  clerkId: string;
  email: string;
  name: string;
}) {
  const [user] = await db
    .insert(UsersTable)
    .values({ clerkId, email, name })
    .onConflictDoNothing({ target: UsersTable.clerkId })
    .returning();

  if (user) return user;

  const existing = await db.query.UsersTable.findFirst({
    where: (users, { eq }) => eq(users.clerkId, clerkId),
  });
  return existing!;
}
