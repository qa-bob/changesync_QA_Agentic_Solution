import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

/** Known ChangeSync service pages with their URL paths. */
export const SERVICE_PATHS: Record<string, string> = {
  masterclass: '/masterclass',
  leadingThroughChange: '/leading-through-change',
  synergySeminar: '/synergy-seminar',
  changeDesign: '/change-design',
  consulting: '/change-management-consulting',
};

export class ServicesPage extends BasePage {
  readonly path = '/services';

  async navigateToServices(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + this.path, {
      waitUntil: 'domcontentloaded',
    });
  }

  async navigateToService(serviceKey: keyof typeof SERVICE_PATHS): Promise<void> {
    const path = SERVICE_PATHS[serviceKey];
    await this.page.goto(this.url.replace(/\/$/, '') + path, {
      waitUntil: 'domcontentloaded',
    });
  }

  /** Returns all service links visible in the current page's nav or body. */
  async getServiceLinks(): Promise<Array<{ text: string; href: string }>> {
    const links = this.page.locator('a[href]').filter({
      hasText: /masterclass|leading through change|synergy|change design|consulting/i,
    });

    const all = await links.all();
    const results: Array<{ text: string; href: string }> = [];

    for (const link of all) {
      const text = (await link.textContent())?.trim() ?? '';
      const href = (await link.getAttribute('href')) ?? '';
      if (text && href) results.push({ text, href });
    }

    return results;
  }

  /** Returns a locator for a specific service by its name text. */
  getServiceLinkByName(name: string): Locator {
    return this.page.locator('a').filter({ hasText: new RegExp(name, 'i') }).first();
  }

  /** Returns the page heading. */
  async getPageHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    if (await h1.count() > 0) return (await h1.textContent())?.trim() ?? '';
    return '';
  }

  async isLoaded(): Promise<boolean> {
    return (await this.getPageHeading()).length > 0;
  }
}
