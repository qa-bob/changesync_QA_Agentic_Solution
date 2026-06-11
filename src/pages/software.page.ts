import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class SoftwarePage extends BasePage {
  readonly path = '/software';

  async navigateToSoftware(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + this.path, {
      waitUntil: 'domcontentloaded',
    });
  }

  async getPageHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    if (await h1.count() > 0) return (await h1.textContent())?.trim() ?? '';
    const h2 = this.page.locator('h2').first();
    if (await h2.count() > 0) return (await h2.textContent())?.trim() ?? '';
    return '';
  }

  /** Returns all feature capability cards / grid items on the software page. */
  async getFeatureCards(): Promise<Locator[]> {
    const candidates = [
      this.page.locator('[class*="feature"]'),
      this.page.locator('[class*="capability"]'),
      this.page.locator('[class*="card"]'),
      this.page.locator('[class*="service-item"]'),
    ];

    for (const candidate of candidates) {
      const count = await candidate.count();
      if (count >= 3) return candidate.all();
    }

    // Fallback: h3-headed content blocks, a common pattern for feature grids
    return this.page.locator('h3').all();
  }

  /** Returns "Book a Demo" / demo CTA links or buttons. */
  async getDemoCTAs(): Promise<Locator[]> {
    return this.page.locator('a, button').filter({
      hasText: /book a demo|request a demo|get a demo|schedule a demo/i,
    }).all();
  }

  /** Returns whether the SOC 2 compliance badge is visible. */
  async hasComplianceBadge(): Promise<boolean> {
    const badge = this.page.locator('img, [class*="badge"], [class*="compliance"]').filter({
      hasText: /soc.?2|soc2/i,
    });
    const imgAlt = this.page.locator('img[alt*="SOC" i], img[alt*="compliance" i]');

    return (await badge.count() > 0) || (await imgAlt.count() > 0);
  }

  /** Returns the count of visible section headings (h2/h3) on the page. */
  async getSectionHeadingCount(): Promise<number> {
    return this.page.locator('h2, h3').count();
  }

  async isLoaded(): Promise<boolean> {
    const heading = await this.getPageHeading();
    return heading.length > 0;
  }
}
