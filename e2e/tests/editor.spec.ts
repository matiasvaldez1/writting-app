import { test, expect } from "@playwright/test";
import { EditorPage } from "../pages/editor.page";

test.describe("Editor", () => {
  test.skip("editor loads and shows contenteditable area", async ({ page }) => {
    const editor = new EditorPage(page);
    await editor.goto(1, 1);
    await expect(editor.contentEditable).toBeVisible();
    await expect(editor.contentEditable).toHaveAttribute(
      "contenteditable",
      "true"
    );
  });

  test.skip("typing text updates word count", async ({ page }) => {
    const editor = new EditorPage(page);
    await editor.goto(1, 1);
    await expect(editor.contentEditable).toBeVisible();

    await editor.typeInEditor("hello world testing word count");
    await page.waitForTimeout(500);

    await expect(editor.wordCount).toBeVisible();
    const wordCountText = await editor.wordCount.textContent();
    expect(wordCountText).toMatch(/\d+ words/i);
    const count = parseInt(wordCountText?.match(/(\d+)/)?.[1] ?? "0", 10);
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test.skip("bold shortcut formats text", async ({ page }) => {
    const editor = new EditorPage(page);
    await editor.goto(1, 1);
    await expect(editor.contentEditable).toBeVisible();

    await editor.typeInEditor("bold text test");
    await editor.selectAllText();
    await editor.bold();

    const boldElement = editor.contentEditable.locator("strong");
    await expect(boldElement).toBeVisible();
    await expect(boldElement).toContainText("bold text test");
  });

  test.skip("auto-save triggers after typing", async ({ page }) => {
    const editor = new EditorPage(page);
    await editor.goto(1, 1);
    await expect(editor.contentEditable).toBeVisible();

    await editor.typeInEditor("auto save test content");

    await expect(editor.savingIndicator).toBeVisible({ timeout: 5000 });
    await expect(editor.savedIndicator).toBeVisible({ timeout: 10000 });
  });

  test.skip("Ctrl+S triggers immediate save", async ({ page }) => {
    const editor = new EditorPage(page);
    await editor.goto(1, 1);
    await expect(editor.contentEditable).toBeVisible();

    await editor.typeInEditor("ctrl s save test");
    await editor.triggerSave();

    await expect(editor.savingIndicator).toBeVisible({ timeout: 3000 });
    await expect(editor.savedIndicator).toBeVisible({ timeout: 10000 });
  });

  test.skip("undo/redo works", async ({ page }) => {
    const editor = new EditorPage(page);
    await editor.goto(1, 1);
    await expect(editor.contentEditable).toBeVisible();

    await editor.selectAllText();
    await page.keyboard.press("Backspace");

    const testText = "undo redo test";
    await editor.typeInEditor(testText);
    await expect(editor.contentEditable).toContainText(testText);

    await editor.undo();
    await page.waitForTimeout(200);
    const textAfterUndo = await editor.contentEditable.textContent();
    expect(textAfterUndo).not.toContain(testText);

    await editor.redo();
    await page.waitForTimeout(200);
    await expect(editor.contentEditable).toContainText(testText);
  });

  test.skip("back button navigates to book edit page", async ({ page }) => {
    const editor = new EditorPage(page);
    await editor.goto(1, 1);
    await expect(editor.contentEditable).toBeVisible();

    await editor.backButton.click();
    await expect(page).toHaveURL(/\/dashboard\/books\/\d+\/edit$/);
  });

  test.skip("content persists after reload", async ({ page }) => {
    const editor = new EditorPage(page);
    await editor.goto(1, 1);
    await expect(editor.contentEditable).toBeVisible();

    const uniqueText = `persist-test-${Date.now()}`;
    await editor.typeInEditor(uniqueText);

    await editor.editor.waitForAutoSave();

    await page.reload();
    await expect(editor.contentEditable).toBeVisible();
    await expect(editor.contentEditable).toContainText(uniqueText);
  });

  test.skip("editor shows chapter title in top bar", async ({ page }) => {
    const editor = new EditorPage(page);
    await editor.goto(1, 1);
    await expect(editor.contentEditable).toBeVisible();

    const topBar = page.locator(".sticky.top-0");
    await expect(topBar).toBeVisible();
    const topBarText = await topBar.textContent();
    expect(topBarText?.length).toBeGreaterThan(0);
  });

  test.skip("fullscreen toggle is available", async ({ page }) => {
    const editor = new EditorPage(page);
    await editor.goto(1, 1);
    await expect(editor.contentEditable).toBeVisible();
    await expect(editor.fullscreenButton).toBeVisible();
  });
});
