import type { Page } from "@playwright/test";

export class BooksPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/dashboard/books");
  }

  get searchInput() {
    return this.page.getByPlaceholder(/search books/i);
  }

  get createBookButton() {
    return this.page.getByRole("button", { name: /create new book/i });
  }

  get bookCards() {
    return this.page
      .locator("[class*=rounded-xl]")
      .filter({ has: this.page.locator("h2") });
  }

  get sortTrigger() {
    return this.page.locator("[data-radix-collection-item]").first();
  }

  get dialogSaveButton() {
    return this.page.getByRole("button", { name: /^save$/i });
  }

  get validationErrors() {
    return this.page.locator("span.text-destructive");
  }

  get noMatchMessage() {
    return this.page.getByText(/no books match/i);
  }

  async createBook(name: string, description: string) {
    await this.createBookButton.click();
    await this.page.getByLabel(/book name/i).fill(name);
    await this.page.getByLabel(/book description/i).fill(description);
    await this.page.getByRole("button", { name: /save/i }).click();
  }

  async openCreateDialog() {
    await this.createBookButton.click();
  }

  async submitCreateDialogEmpty() {
    await this.createBookButton.click();
    await this.dialogSaveButton.click();
  }

  async searchBooks(query: string) {
    await this.searchInput.fill(query);
  }

  async sortBy(option: string) {
    await this.page.locator("button[role='combobox']").click();
    await this.page
      .getByRole("option", { name: new RegExp(option, "i") })
      .click();
  }

  async getBookCount(): Promise<number> {
    return this.bookCards.count();
  }

  getBookCardByName(name: string) {
    return this.page.locator("h2", { hasText: name }).first();
  }
}
