import { test, expect } from "@playwright/test";
import { LandingPage } from "../pages/landing.page";

test.describe("Landing page", () => {
  test("shows hero section with expected heading", async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.goto();
    await expect(landing.heroTitle).toBeVisible();
    await expect(landing.heroTitle).toHaveText(/write.*organize.*publish/i);
  });

  test("features section shows 3 feature cards (Edit, Manage, Export)", async ({
    page,
  }) => {
    const landing = new LandingPage(page);
    await landing.goto();
    await expect(landing.featureCards).toHaveCount(3);
    await expect(landing.featureCards.nth(0)).toContainText(/edit your book/i);
    await expect(landing.featureCards.nth(1)).toContainText(/manage chapters/i);
    await expect(landing.featureCards.nth(2)).toContainText(/export as pdf/i);
  });

  test("footer is visible and shows links", async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.goto();
    await expect(landing.footer).toBeVisible();
    const linkCount = await landing.footerLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(4);
    await expect(
      landing.footerLinks.filter({ hasText: /how it works/i })
    ).toBeVisible();
    await expect(landing.footerLinks.filter({ hasText: /faq/i })).toBeVisible();
    await expect(
      landing.footerLinks.filter({ hasText: /contact/i })
    ).toBeVisible();
    await expect(
      landing.footerLinks.filter({ hasText: /privacy policy/i })
    ).toBeVisible();
  });

  test("CTA section is visible with sign-up prompt", async ({ page }) => {
    const context = await page.context().browser()!.newContext();
    const freshPage = await context.newPage();
    await freshPage.goto("/");
    await expect(freshPage.getByText(/sign up to start using/i)).toBeVisible();
    await expect(
      freshPage.getByRole("link", { name: /sign up/i })
    ).toBeVisible();
    await context.close();
  });

  test("blockquote with Stephen King quote is visible", async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.goto();
    await expect(landing.blockquote).toBeVisible();
    await expect(landing.blockquote).toContainText(/stephen king/i);
  });

  test("sign in link is visible for unauthenticated users", async ({
    page,
  }) => {
    const context = await page.context().browser()!.newContext();
    const freshPage = await context.newPage();
    const landing = new LandingPage(freshPage);
    await landing.goto();
    await expect(landing.signInLink).toBeVisible();
    await context.close();
  });

  test("unauthenticated user redirected from dashboard", async ({ page }) => {
    const context = await page.context().browser()!.newContext();
    const freshPage = await context.newPage();
    await freshPage.goto("/dashboard");
    await expect(freshPage).not.toHaveURL(/\/dashboard$/);
    await context.close();
  });
});
