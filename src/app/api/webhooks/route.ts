import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { UsersTable } from "@/drizzle/schema";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Error occurred -- invalid signature", {
      status: 400,
    });
  }

  if (evt.type !== "user.created") {
    return new Response("Event type not handled", { status: 200 });
  }

  const { email_addresses, first_name, last_name, id } = evt.data;
  const email = email_addresses?.[0]?.email_address;

  if (!email || !id) {
    return new Response("Missing required user data", { status: 400 });
  }

  const nameParts = [first_name, last_name].filter(Boolean);
  const name = nameParts.length > 0 ? nameParts.join(" ") : "User";

  try {
    const [userInserted] = await db
      .insert(UsersTable)
      .values({ email, name, clerkId: id })
      .returning({ insertedEmail: UsersTable.email });

    if (!userInserted) {
      return new Response("Failed to insert user", { status: 500 });
    }

    return new Response("User inserted", { status: 200 });
  } catch {
    return new Response("There was an error inserting the user", {
      status: 500,
    });
  }
}
