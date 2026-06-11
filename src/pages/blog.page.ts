import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class BlogPage extends BasePage {
  readonly path = '/blog';

  async navigateToBlog(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + this.path, {
      waitUntil: 'domcontentloaded',
    });
  }

  async getPageHeading(): Promise<string> {
    const h1 = this.page.locator('h1').first();
    if (await h1.count() > 0) return (await h1.textContent())?.trim() ?? '';
    return '';
  }

  /** Returns all blog post article cards / list items. */
  async getArticleCards(): Promise<Locator[]> {
    const candidates = [
      // Wix blog posts use href="/post/slug" URL pattern
      this.page.locator('a[href*="/post/"]'),
      this.page.locator('a[href*="/blog/"]').filter({ hasNot: this.page.locator('nav, header') }),
      this.page.locator('article'),
      this.page.locator('[class*="post"]'),
      this.page.locator('[class*="blog-item"]'),
      this.page.locator('[class*="article"]'),
    ];

    for (const candidate of candidates) {
      const count = await candidate.count();
      if (count > 3) return candidate.all();
    }

    // Last resort: all links inside the main content area that aren't nav links
    const mainLinks = this.page.locator('main a[href], [role="main"] a[href]');
    if (await mainLinks.count() > 3) return mainLinks.all();

    return [];
  }

  /** Returns the count of article cards on the current page. */
  async getArticleCount(): Promise<number> {
    return (await this.getArticleCards()).length;
  }

  /** Returns all "Read more" or post title links. */
  async getArticleLinks(): Promise<Array<{ text: string; href: string }>> {
    const links = this.page.locator('a').filter({
      hasText: /read more|read post|continue reading/i,
    });

    const titleLinks = this.page.locator('article a, [class*="post"] a[href]');

    const source = (await links.count() > 0) ? links : titleLinks;
    const all = await source.all();
    const results: Array<{ text: string; href: string }> = [];

    for (const link of all) {
      const text = (await link.textContent())?.trim() ?? '';
      const href = (await link.getAttribute('href')) ?? '';
      if (text && href) results.push({ text, href });
    }

    return results;
  }

  async isLoaded(): Promise<boolean> {
    return (await this.getPageHeading()).length > 0;
  }
}
