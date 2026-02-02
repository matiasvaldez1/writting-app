import type { Page, Locator } from "@playwright/test";

export class LandingPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  get heroTitle() {
    return this.page.getByRole("heading", { level: 1 });
  }

  get signInLink() {
    return this.page.getByRole("link", { name: /sign in/i });
  }

  get getStartedButton() {
    return this.page.getByRole("link", { name: /get started/i });
  }

  get featureCards(): Locator {
    return this.page.locator("h2.text-4xl");
  }

  get footer() {
    return this.page.locator("footer");
  }

  get footerLinks() {
    return this.page.locator("footer a");
  }

  get ctaSection() {
    return this.page.locator("text=/sign up/i").first();
  }

  get blockquote() {
    return this.page.locator("blockquote");
  }
}
