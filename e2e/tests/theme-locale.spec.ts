import { test, expect } from "@playwright/test";

test.describe("Theme and locale", () => {
  test("theme toggle switches between light and dark", async ({ page }) => {
    await page.goto("/dashboard");
    const html = page.locator("html");
    const themeButton = page.getByRole("button", { name: /toggle theme/i });
    await expect(themeButton).toBeVisible();

    await themeButton.click();
    const lightOption = page.getByRole("menuitem", { name: /light/i });
    await lightOption.click();
    await expect(html).toHaveClass(/light/);

    await themeButton.click();
    const darkOption = page.getByRole("menuitem", { name: /dark/i });
    await darkOption.click();
    await expect(html).toHaveClass(/dark/);
  });

  test("locale toggle switches language to Spanish", async ({ page }) => {
    await page.goto("/dashboard");
    const localeButton = page.getByRole("button", {
      name: /toggle language/i,
    });
    await expect(localeButton).toBeVisible();

    await localeButton.click();
    const esOption = page.getByRole("menuitem", { name: /es/i });
    await esOption.click();

    await page.waitForTimeout(1000);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });

  test("locale toggle switches language back to English", async ({ page }) => {
    await page.goto("/dashboard");
    const localeButton = page.getByRole("button", {
      name: /toggle language/i,
    });

    await localeButton.click();
    await page.getByRole("menuitem", { name: /es/i }).click();
    await page.waitForTimeout(1000);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await localeButton.click();
    await page.getByRole("menuitem", { name: /en/i }).click();
    await page.waitForTimeout(1000);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("locale persists after page navigation", async ({ page }) => {
    await page.goto("/dashboard");
    const localeButton = page.getByRole("button", {
      name: /toggle language/i,
    });

    await localeButton.click();
    await page.getByRole("menuitem", { name: /es/i }).click();
    await page.waitForTimeout(1000);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await page.goto("/dashboard/books");
    await page.waitForTimeout(500);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByText(/tus libros/i)).toBeVisible();

    await localeButton.click();
    await page.getByRole("menuitem", { name: /en/i }).click();
    await page.waitForTimeout(1000);
  });

  test("theme persists after page navigation", async ({ page }) => {
    await page.goto("/dashboard");
    const html = page.locator("html");
    const themeButton = page.getByRole("button", { name: /toggle theme/i });

    await themeButton.click();
    await page.getByRole("menuitem", { name: /light/i }).click();
    await expect(html).toHaveClass(/light/);

    await page.goto("/dashboard/books");
    await expect(html).toHaveClass(/light/);

    await themeButton.click();
    await page.getByRole("menuitem", { name: /dark/i }).click();
  });

  test("Spanish locale shows translated book page title", async ({ page }) => {
    await page.goto("/dashboard");
    const localeButton = page.getByRole("button", {
      name: /toggle language/i,
    });

    await localeButton.click();
    await page.getByRole("menuitem", { name: /es/i }).click();
    await page.waitForTimeout(1000);

    await page.goto("/dashboard/books");
    await page.waitForTimeout(500);
    await expect(page.getByText(/tus libros/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /crear nuevo libro/i })
    ).toBeVisible();

    await localeButton.click();
    await page.getByRole("menuitem", { name: /en/i }).click();
    await page.waitForTimeout(1000);
  });
});
