import { z } from "zod";

const envSchema = z.object({
  POSTGRES_URL: z.string().min(1, "POSTGRES_URL is required"),
  WEBHOOK_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  const message = Object.entries(formatted)
    .map(([key, errors]) => `  ${key}: ${errors?.join(", ")}`)
    .join("\n");
  throw new Error(`Missing required environment variables:\n${message}`);
}

export const env = parsed.data;
