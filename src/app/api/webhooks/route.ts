import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
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
    return new Response("Error occured -- no svix headers", {
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
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  try {
    if (payload.type === "user.created") {
      const userInserted = await db
        .insert(UsersTable)
        .values({
          email: payload?.data?.email_addresses[0]?.email_address,
          name: payload?.data.first_name + payload.data.last_name,
          clerkId: payload?.data?.id,
        })
        .returning({ insertedEmail: UsersTable.email });

      console.log("User inserted", userInserted);

      return new Response("User inserted", { status: 200 });
    }
  } catch (error) {
    return new Response("There was an error inserting the user", {
      status: 400,
    });
  }
}
