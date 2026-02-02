import type { Page } from "@playwright/test";

export class EditorHelper {
  constructor(private page: Page) {}

  get editorLocator() {
    return this.page.locator('[contenteditable="true"]');
  }

  async typeText(text: string) {
    await this.editorLocator.click();
    await this.page.keyboard.type(text);
  }

  async selectAll() {
    await this.editorLocator.click();
    await this.page.keyboard.press("Control+a");
  }

  async waitForAutoSave() {
    await this.page.getByText(/saving/i).waitFor({ timeout: 5000 });
    await this.page.getByText(/saved/i).waitFor({ timeout: 10000 });
  }

  async getWordCount(): Promise<string> {
    return (
      (await this.page.locator("text=/\\d+ words/").textContent()) ?? "0 words"
    );
  }
}
