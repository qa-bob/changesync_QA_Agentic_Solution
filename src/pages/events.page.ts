import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class EventsPage extends BasePage {
  readonly path = '/nextwave-change-collective';

  async navigateToEvents(): Promise<void> {
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

  /** Returns visible ticket / pricing tier elements. */
  async getTicketTiers(): Promise<Locator[]> {
    const candidates = [
      this.page.locator('[class*="pricing"], [class*="ticket"], [class*="tier"], [class*="plan"]'),
      this.page.locator('[class*="card"]').filter({ hasText: /\$|free|personal|team|virtual|in.person/i }),
    ];
    for (const candidate of candidates) {
      if (await candidate.count() >= 2) return candidate.all();
    }
    return [];
  }

  /** Returns the primary registration / ticket CTA. */
  getRegistrationCTA(): Locator {
    return this.page.locator('a, button').filter({
      hasText: /register|secure your spot|get tickets|buy tickets|book now/i,
    }).first();
  }

  /** Returns true if an event date or year is mentioned on the page. */
  async hasEventDateMention(): Promise<boolean> {
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return /july|2024|2025|2026|2027|\d{1,2}\/\d{1,2}\/\d{2,4}/i.test(bodyText);
  }

  /** Returns true if the speaker section or speaker names are present. */
  async hasSpeakerSection(): Promise<boolean> {
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return /speaker|keynote|kate degon/i.test(bodyText);
  }

  /** Returns true if a newsletter / updates signup form exists. */
  async hasUpdatesSignupForm(): Promise<boolean> {
    const form = this.page.locator('form');
    const embedFrame = this.page.locator('iframe[src*="sibforms"], iframe[src*="sendinblue"]');
    return (await form.count() > 0) || (await embedFrame.count() > 0);
  }

  async isLoaded(): Promise<boolean> {
    return (await this.getPageHeading()).length > 0;
  }
}
