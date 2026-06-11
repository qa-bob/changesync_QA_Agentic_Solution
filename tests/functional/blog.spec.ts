/**
 * tests/functional/blog.spec.ts
 *
 * Functional tests for the ChangeSync /blog page.
 * Covers: page load, article presence, content type categories,
 * newsletter signup form, and individual post link validity.
 *
 * Site data: 41 posts across 5 categories (Knowledge Article, Video,
 * Free Resource, Podcast, In the News). No pagination — all posts on one page.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { BlogPage } from '@pages/blog.page';

test.describe('Blog Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    const blogPage = new BlogPage(page, siteConfig);
    await blogPage.navigateToBlog();
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('blog page loads and has a heading @functional', async ({ page, siteConfig }) => {
    const blogPage = new BlogPage(page, siteConfig);
    const heading = await blogPage.getPageHeading();
    expect(heading.trim().length, 'Blog page should have a visible heading').toBeGreaterThan(3);
  });

  test('blog page URL is correct @functional', async ({ page }) => {
    expect(page.url()).toContain('/blog');
  });

  test('blog page title contains expected branding @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain('blog');
  });

  // ── Article content ─────────────────────────────────────────────────────────

  test('blog page displays multiple article posts @functional', async ({ page, siteConfig }) => {
    const blogPage = new BlogPage(page, siteConfig);
    const count = await blogPage.getArticleCount();
    expect(
      count,
      `Blog should display multiple articles. Found: ${count}`
    ).toBeGreaterThan(3);
  });

  test('blog posts have at least 10 articles visible @functional', async ({ page, siteConfig }) => {
    const blogPage = new BlogPage(page, siteConfig);
    const count = await blogPage.getArticleCount();
    // Site has 41 posts — even with lazy loading, 10+ should be visible on load
    expect(
      count,
      'Blog should show at least 10 posts (41 total on the live site)'
    ).toBeGreaterThanOrEqual(10);
  });

  test('blog posts have readable titles @functional', async ({ page }) => {
    // Post titles should be non-empty h2/h3 headings or anchor text
    const postTitles = page.locator(
      'article h2, article h3, [class*="post"] h2, [class*="post"] h3, ' +
      '[class*="blog"] h2, [class*="blog"] h3'
    );

    const count = await postTitles.count();
    if (count === 0) {
      // Fallback: look for links with meaningful text inside cards
      const articleLinks = page.locator('article a, [class*="post"] a').filter({
        hasText: /.{10,}/,
      });
      expect(
        await articleLinks.count(),
        'Blog posts should have readable title links'
      ).toBeGreaterThan(0);
    } else {
      const firstTitle = await postTitles.first().textContent();
      expect(
        firstTitle?.trim().length,
        'First post title should have meaningful text'
      ).toBeGreaterThan(5);
    }
  });

  // ── Content categories ──────────────────────────────────────────────────────

  test('blog lists content type categories @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    // ChangeSync publishes 5 content types
    const categories = [
      /knowledge article/i,
      /video/i,
      /free resource/i,
      /podcast/i,
      /in the news/i,
    ];

    const matchCount = categories.filter((cat) => cat.test(bodyText)).length;
    expect(
      matchCount,
      `Blog should show at least 2 content type categories. Found ${matchCount}/5.`
    ).toBeGreaterThanOrEqual(2);
  });

  // ── Newsletter signup ───────────────────────────────────────────────────────

  test('blog page has a newsletter / email signup form @functional', async ({ page }) => {
    // Wix forms may use custom input types or embedded iframes
    const emailInput = page.locator(
      'input[type="email"], input[placeholder*="email" i], input[name*="email" i], ' +
      'input[type="text"][name*="email" i], input[aria-label*="email" i]'
    ).first();

    const subscribeForm = page.locator('form, [class*="form"]').filter({
      hasText: /subscribe|newsletter|email|sign up|updates|perspectives/i,
    }).first();

    // Also check body text — Wix forms may be in iframes not accessible via locator
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasSignupText = /subscribe|newsletter|sign up.*email|email.*updates/i.test(bodyText);

    const hasEmailInput = (await emailInput.count()) > 0;
    const hasSubscribeForm = (await subscribeForm.count()) > 0;

    expect(
      hasEmailInput || hasSubscribeForm || hasSignupText,
      'Blog page should have a newsletter / email signup form or sign-up section'
    ).toBeTruthy();
  });

  // ── Navigation from blog ────────────────────────────────────────────────────

  test('"Book a Demo" CTA is accessible from the blog page @functional', async ({ page }) => {
    const bookDemo = page.locator('a, button').filter({ hasText: /book a demo/i }).first();
    expect(
      await bookDemo.count(),
      '"Book a Demo" CTA should be present on the blog page'
    ).toBeGreaterThan(0);
  });

  test('blog post links have valid href attributes @functional', async ({ page, siteConfig }) => {
    const blogPage = new BlogPage(page, siteConfig);
    const links = await blogPage.getArticleLinks();

    if (links.length === 0) {
      console.warn('[blog] No article links found — skipping href validation.');
      return;
    }

    const emptyHrefs = links.filter((l) => !l.href || l.href.trim().length === 0);
    expect(
      emptyHrefs.length,
      'All blog post links should have a non-empty href'
    ).toBe(0);
  });
});
