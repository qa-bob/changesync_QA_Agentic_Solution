/**
 * tests/functional/about-page.spec.ts
 *
 * Functional tests for the ChangeSync /about page.
 * Covers: page load, leadership team mention, company stats,
 * credentials, and mission/value copy.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { AboutPage } from '@pages/about.page';

test.describe('About Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    const aboutPage = new AboutPage(page, siteConfig);
    await aboutPage.navigateToAbout();
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('about page loads successfully @functional', async ({ page }) => {
    const status = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return nav?.responseStatus ?? 200;
    });
    expect(status, 'About page should return a successful HTTP status').toBeLessThan(400);
  });

  test('about page has a meaningful heading @functional', async ({ page, siteConfig }) => {
    const aboutPage = new AboutPage(page, siteConfig);
    const heading = await aboutPage.getPageHeading();
    expect(heading.trim().length, 'About page should have a visible H1 heading').toBeGreaterThan(3);
  });

  test('about page URL is correct @functional', async ({ page }) => {
    expect(page.url()).toContain('/about');
  });

  // ── Leadership team ─────────────────────────────────────────────────────────

  test('about page mentions the founder @functional', async ({ page, siteConfig }) => {
    const aboutPage = new AboutPage(page, siteConfig);
    const hasFounder = await aboutPage.hasFounderMention();
    expect(hasFounder, 'About page should mention founder Kate DeGon').toBeTruthy();
  });

  test('about page has a team / leadership section @functional', async ({ page, siteConfig }) => {
    const aboutPage = new AboutPage(page, siteConfig);
    const hasTeam = await aboutPage.hasTeamSection();

    if (!hasTeam) {
      // Soft fallback: page should at least contain people names or team-related text
      const bodyText = await page.evaluate<string>(() => document.body.innerText);
      expect(
        /team|staff|leadership|people|meet/i.test(bodyText),
        'About page should have some team-related content'
      ).toBeTruthy();
    } else {
      expect(hasTeam).toBeTruthy();
    }
  });

  // ── Company credentials ──────────────────────────────────────────────────────

  test('about page mentions company credentials or certifications @functional', async ({ page, siteConfig }) => {
    const aboutPage = new AboutPage(page, siteConfig);
    const hasCredentials = await aboutPage.hasCredentialsMention();
    expect(hasCredentials, 'About page should mention certifications or credentials').toBeTruthy();
  });

  test('about page references years in business or experience @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasExperience =
      /\d+\+?\s*years|years.{0,20}experience|since \d{4}/i.test(bodyText);
    expect(
      hasExperience,
      'About page should reference years of experience or business history'
    ).toBeTruthy();
  });

  // ── Industries served ────────────────────────────────────────────────────────

  test('about page references industries or client types served @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasIndustry =
      /industry|industries|enterprise|fortune|healthcare|government|manufacturing/i.test(bodyText);
    expect(
      hasIndustry,
      'About page should reference the industries or types of clients served'
    ).toBeTruthy();
  });

  // ── Mission / values ─────────────────────────────────────────────────────────

  test('about page contains mission or values language @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasMission =
      /mission|vision|values|believe|purpose|committed|dedicated/i.test(bodyText);
    expect(
      hasMission,
      'About page should contain mission, vision, or values language'
    ).toBeTruthy();
  });
});
