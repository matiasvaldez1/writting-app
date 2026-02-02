import { test, expect } from "@playwright/test";
import { BooksPage } from "../pages/books.page";

test.describe("Books CRUD", () => {
  test("create book with validation - empty name shows error", async ({
    page,
  }) => {
    const books = new BooksPage(page);
    await books.goto();
    await books.openCreateDialog();
    await books.dialogSaveButton.click();
    await expect(books.validationErrors.first()).toBeVisible();
    await expect(books.validationErrors.first()).toContainText(/longer/i);
  });

  test("create book with validation - short description shows error", async ({
    page,
  }) => {
    const books = new BooksPage(page);
    await books.goto();
    await books.openCreateDialog();
    await page.getByLabel(/book name/i).fill("Valid Name");
    await page.getByLabel(/book description/i).fill("Short");
    await books.dialogSaveButton.click();
    await expect(books.validationErrors.first()).toBeVisible();
    await expect(books.validationErrors.first()).toContainText(/longer/i);
  });

  test("create book via dialog and verify it appears in grid", async ({
    page,
  }) => {
    const books = new BooksPage(page);
    await books.goto();
    const initialCount = await books.getBookCount();
    const uniqueName = `E2E Book ${Date.now()}`;
    await books.createBook(
      uniqueName,
      "A test book created by Playwright for end-to-end testing purposes"
    );
    await page.waitForTimeout(1000);
    await expect(books.getBookCardByName(uniqueName)).toBeVisible();
    const newCount = await books.getBookCount();
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test("search books filters the grid", async ({ page }) => {
    const books = new BooksPage(page);
    await books.goto();
    await books.searchBooks("zzz_nonexistent_book_zzz");
    await page.waitForTimeout(500);
    await expect(page.getByText(/no books match/i)).toBeVisible();
  });

  test.skip("sort books by different criteria", async ({ page }) => {
    const books = new BooksPage(page);
    await books.goto();

    await books.sortBy("Oldest first");
    await expect(page).toHaveURL(/sort=oldest/);

    await books.sortBy("Name");
    await expect(page).toHaveURL(/sort=name/);

    await books.sortBy("Most chapters");
    await expect(page).toHaveURL(/sort=chapters/);

    await books.sortBy("Newest first");
    await expect(page).toHaveURL(/sort=newest/);
  });

  test.skip("book card shows chapter count", async ({ page }) => {
    const books = new BooksPage(page);
    await books.goto();
    const firstCard = books.bookCards.first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator("text=/\\d+ chapters/i")).toBeVisible();
  });

  test("create book dialog can be closed", async ({ page }) => {
    const books = new BooksPage(page);
    await books.goto();
    await books.openCreateDialog();
    await expect(page.getByLabel(/book name/i)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByLabel(/book name/i)).not.toBeVisible();
  });

  test.skip("delete book removes it from grid", async ({ page }) => {
    const books = new BooksPage(page);
    await books.goto();
    const uniqueName = `E2E Delete Book ${Date.now()}`;
    await books.createBook(
      uniqueName,
      "A temporary book that will be deleted in this test run"
    );
    await page.waitForTimeout(1000);
    await expect(books.getBookCardByName(uniqueName)).toBeVisible();

    const bookCard = books.getBookCardByName(uniqueName);
    const cardContainer = bookCard.locator(
      "xpath=ancestor::div[contains(@class,'rounded-xl')]"
    );
    await cardContainer.locator("button").last().click();
    await page.getByRole("menuitem", { name: /delete/i }).click();
    await page.waitForTimeout(1000);
    await expect(books.getBookCardByName(uniqueName)).not.toBeVisible();
  });
});
