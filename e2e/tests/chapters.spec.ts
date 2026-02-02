import { test, expect } from "@playwright/test";

test.describe("Chapter management", () => {
  test.skip("add chapter increases chapter count", async ({ page }) => {
    await page.goto("/dashboard/books/1/edit");
    const chapterItems = page.locator("ul li");
    const initialCount = await chapterItems.count();

    await page.getByRole("button", { name: /add chapter/i }).click();
    await page.waitForTimeout(1000);

    const newCount = await chapterItems.count();
    expect(newCount).toBe(initialCount + 1);
  });

  test.skip("edit chapter title inline", async ({ page }) => {
    await page.goto("/dashboard/books/1/edit");
    const firstChapter = page.locator("ul li").first();
    await expect(firstChapter).toBeVisible();

    const pencilIcon = firstChapter
      .locator("svg.lucide-pencil, svg[class*='Pencil']")
      .first();
    await pencilIcon.click();

    const titleInput = firstChapter.locator("input[type='text']").first();
    await expect(titleInput).toBeVisible();

    const newTitle = `Renamed Chapter ${Date.now()}`;
    await titleInput.clear();
    await titleInput.fill(newTitle);

    const checkIcon = firstChapter.locator("svg[class*='Check']").first();
    await checkIcon.click();

    await page.waitForTimeout(500);
    await expect(firstChapter).toContainText(newTitle);
  });

  test.skip("delete chapter removes it from list", async ({ page }) => {
    await page.goto("/dashboard/books/1/edit");
    const chapterItems = page.locator("ul li");
    const initialCount = await chapterItems.count();
    expect(initialCount).toBeGreaterThan(0);

    const deleteButton = chapterItems
      .first()
      .locator("button[title*='Delete' i], button[title*='delete' i]")
      .first();
    await deleteButton.click();
    await page.waitForTimeout(1000);

    const newCount = await chapterItems.count();
    expect(newCount).toBe(initialCount - 1);
  });

  test.skip("drag and drop reorders chapters", async ({ page }) => {
    await page.goto("/dashboard/books/1/edit");
    const chapterItems = page.locator("ul li");
    const count = await chapterItems.count();
    expect(count).toBeGreaterThanOrEqual(2);

    const firstTitle = await chapterItems
      .nth(0)
      .locator("h2")
      .first()
      .textContent();
    const secondTitle = await chapterItems
      .nth(1)
      .locator("h2")
      .first()
      .textContent();

    const source = chapterItems.nth(0).locator("button").last();
    const target = chapterItems.nth(1);

    const sourceBounds = await source.boundingBox();
    const targetBounds = await target.boundingBox();

    if (sourceBounds && targetBounds) {
      await page.mouse.move(
        sourceBounds.x + sourceBounds.width / 2,
        sourceBounds.y + sourceBounds.height / 2
      );
      await page.mouse.down();
      await page.mouse.move(
        targetBounds.x + targetBounds.width / 2,
        targetBounds.y + targetBounds.height / 2,
        { steps: 10 }
      );
      await page.mouse.up();
    }

    await page.waitForTimeout(500);
    const newFirstTitle = await chapterItems
      .nth(0)
      .locator("h2")
      .first()
      .textContent();
    const newSecondTitle = await chapterItems
      .nth(1)
      .locator("h2")
      .first()
      .textContent();

    expect(newFirstTitle).toBe(secondTitle);
    expect(newSecondTitle).toBe(firstTitle);
  });

  test.skip("chapter list shows word count per chapter", async ({ page }) => {
    await page.goto("/dashboard/books/1/edit");
    const chapterItems = page.locator("ul li");
    const firstChapter = chapterItems.first();
    await expect(firstChapter).toBeVisible();
    await expect(firstChapter.locator("text=/\\d+\\s+words/i")).toBeVisible();
  });

  test.skip("clicking chapter navigates to editor", async ({ page }) => {
    await page.goto("/dashboard/books/1/edit");
    const firstChapterLink = page.locator("ul li a").first();
    await expect(firstChapterLink).toBeVisible();
    await firstChapterLink.click();
    await expect(page).toHaveURL(/\/editor$/);
  });
});
