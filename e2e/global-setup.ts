import { test as setup, expect } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const email = process.env.E2E_CLERK_USER_EMAIL;
  const password = process.env.E2E_CLERK_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "E2E_CLERK_USER_EMAIL and E2E_CLERK_USER_PASSWORD must be set"
    );
  }

  await page.goto("/");
  await page.getByRole("link", { name: /sign in/i }).click();
  await page.getByLabel(/email/i).fill(email);
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /continue/i }).click();

  await page.waitForURL(/dashboard/);
  await expect(page).toHaveURL(/dashboard/);

  await page.context().storageState({ path: authFile });
});
