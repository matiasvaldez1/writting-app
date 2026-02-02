import type { Page } from "@playwright/test";
import { EditorHelper } from "../fixtures/editor.fixture";

export class EditorPage {
  editor: EditorHelper;

  constructor(private page: Page) {
    this.editor = new EditorHelper(page);
  }

  async goto(bookId: number, chapterId: number) {
    await this.page.goto(`/dashboard/books/${bookId}/edit/${chapterId}/editor`);
  }

  get backButton() {
    return this.page.locator("button[title='Back']");
  }

  get saveStatus() {
    return this.page.locator("text=/saved|saving|save failed/i");
  }

  get savedIndicator() {
    return this.page.getByText(/^saved$/i);
  }

  get savingIndicator() {
    return this.page.getByText(/^saving/i);
  }

  get wordCount() {
    return this.page.locator("text=/\\d+ words/");
  }

  get contentEditable() {
    return this.page.locator('[contenteditable="true"]');
  }

  get undoButton() {
    return this.page.locator("button[title*='Undo']");
  }

  get redoButton() {
    return this.page.locator("button[title*='Redo']");
  }

  get fullscreenButton() {
    return this.page.locator("button[title*='fullscreen' i]");
  }

  async typeInEditor(text: string) {
    await this.contentEditable.click();
    await this.page.keyboard.type(text);
  }

  async selectAllText() {
    await this.contentEditable.click();
    await this.page.keyboard.press("Control+a");
  }

  async triggerSave() {
    await this.page.keyboard.press("Control+s");
  }

  async undo() {
    await this.page.keyboard.press("Control+z");
  }

  async redo() {
    await this.page.keyboard.press("Control+Shift+z");
  }

  async bold() {
    await this.page.keyboard.press("Control+b");
  }
}
