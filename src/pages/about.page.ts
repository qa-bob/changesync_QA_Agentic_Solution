import { BasePage } from '@pages/base.page';

export class AboutPage extends BasePage {
  readonly path = '/about-us';

  async navigateToAbout(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + this.path, {
      waitUntil: 'domcontentloaded',
    });
  }

  async getPageHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    if (await h1.count() > 0) return (await h1.textContent())?.trim() ?? '';
    return '';
  }

  /** Returns true if the founder's name appears on the page. */
  async hasFounderMention(): Promise<boolean> {
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return /kate|degon|founder/i.test(bodyText);
  }

  /** Returns true if team / leadership section is present. */
  async hasTeamSection(): Promise<boolean> {
    const teamSection = this.page.locator(
      '[class*="team"], [class*="leadership"], [class*="about"], ' +
      'section:has-text("team"), section:has-text("leadership")'
    );
    return (await teamSection.count()) > 0;
  }

  /** Returns stat values visible on the page (e.g., "40+ organizations", "8+ years"). */
  async getCompanyStats(): Promise<string[]> {
    const statElements = this.page.locator(
      '[class*="stat"], [class*="metric"], [class*="count"], ' +
      '[class*="number"], [class*="achievement"]'
    );
    const all = await statElements.all();
    const stats: string[] = [];

    for (const el of all) {
      const text = (await el.textContent())?.trim();
      if (text && text.length > 0) stats.push(text);
    }

    return stats;
  }

  /** Returns true if the certifications (WOSB, nationally recognized, etc.) are mentioned. */
  async hasCredentialsMention(): Promise<boolean> {
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return /certified|WOSB|recognized|SOC|compliance/i.test(bodyText);
  }

  async isLoaded(): Promise<boolean> {
    return (await this.getPageHeading()).length > 0;
  }
}
