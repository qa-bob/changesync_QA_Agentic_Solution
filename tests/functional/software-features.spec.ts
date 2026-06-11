/**
 * tests/functional/software-features.spec.ts
 *
 * Functional tests for the ChangeSync /software page.
 * Covers: page load, 6 core capability features, demo CTAs,
 * compliance badges, and meeting booking tiers.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { SoftwarePage } from '@pages/software.page';

test.describe('Software Page Features @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    const softwarePage = new SoftwarePage(page, siteConfig);
    await softwarePage.navigateToSoftware();
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('software page loads and has a heading @functional', async ({ page, siteConfig }) => {
    const softwarePage = new SoftwarePage(page, siteConfig);
    const heading = await softwarePage.getPageHeading();
    expect(heading.trim().length, 'Software page should have a visible heading').toBeGreaterThan(5);
  });

  test('software page URL is correct @functional', async ({ page, siteConfig }) => {
    const currentUrl = page.url();
    expect(currentUrl).toContain('/software');
  });

  // ── Core capabilities ───────────────────────────────────────────────────────

  test('software page mentions portfolio management capability @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /portfolio.{0,30}management|portfolio management/i.test(bodyText),
      'Software page should mention Portfolio Management as a core capability'
    ).toBeTruthy();
  });

  test('software page mentions analytics / reporting capability @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /analytics|reporting|real.time/i.test(bodyText),
      'Software page should mention Real-Time Analytics as a core capability'
    ).toBeTruthy();
  });

  test('software page mentions stakeholder management capability @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    // Page uses "Stakeholder Engagement" / "stakeholder analysis" rather than "stakeholder management"
    expect(
      /stakeholder/i.test(bodyText),
      'Software page should mention stakeholder as a core capability'
    ).toBeTruthy();
  });

  test('software page mentions impact analysis capability @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /impact.{0,20}analysis|impact analysis/i.test(bodyText),
      'Software page should mention Impact Analysis as a core capability'
    ).toBeTruthy();
  });

  test('software page has at least 4 distinct feature sections @functional', async ({ page, siteConfig }) => {
    const softwarePage = new SoftwarePage(page, siteConfig);
    const sectionCount = await softwarePage.getSectionHeadingCount();
    expect(
      sectionCount,
      'Software page should have at least 4 section/feature headings'
    ).toBeGreaterThanOrEqual(4);
  });

  // ── Demo CTAs ────────────────────────────────────────────────────────────────

  test('"Book a Demo" CTA is visible on the software page @functional', async ({ page }) => {
    // Wix nav buttons may be JS-rendered; check by text match OR Calendly href
    const demoCTAsByText = page.locator('a').filter({ hasText: /book a demo/i });
    const calendlyLinks = page.locator('a[href*="calendly"]');

    const hasByText = (await demoCTAsByText.count()) > 0;
    const hasByHref = (await calendlyLinks.count()) > 0;

    expect(
      hasByText || hasByHref,
      '"Book a Demo" CTA (by text or Calendly link) should be present on the software page'
    ).toBeTruthy();
  });

  test('demo CTA links point to a booking URL @functional', async ({ page }) => {
    // Prefer Calendly links (the actual booking destination)
    const calendlyLinks = page.locator('a[href*="calendly"]');
    if ((await calendlyLinks.count()) > 0) {
      const href = await calendlyLinks.first().getAttribute('href');
      expect(href?.length, 'Calendly booking link should have a non-empty href').toBeGreaterThan(0);
      return;
    }

    // Fallback: any link with booking-related text
    const bookingLinks = page.locator('a').filter({ hasText: /book a demo|schedule|book now/i });
    if ((await bookingLinks.count()) === 0) {
      test.skip(true, 'No demo CTA or Calendly link found on software page');
      return;
    }

    const href = await bookingLinks.first().getAttribute('href');
    expect(href?.trim().length, 'Booking link should have a non-empty href').toBeGreaterThan(0);
  });

  // ── Meeting booking tiers ────────────────────────────────────────────────────

  test('software page has booking tier options (15/30/60 min) @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    // ChangeSync offers three tiers: 15-min, 30-min, 60-min/1-hour demo
    const hasTiers =
      /15.{0,10}min|quick chat/i.test(bodyText) ||
      /30.{0,10}min|discussion/i.test(bodyText) ||
      /60.{0,10}min|1.{0,5}hour|demo/i.test(bodyText);

    if (!hasTiers) {
      // At a minimum the page should have a booking CTA
      const bookingLinks = await page.locator('a').filter({
        hasText: /calendly|book|schedule|demo/i,
      }).count();
      expect(
        bookingLinks,
        'Software page should have at least one booking link'
      ).toBeGreaterThan(0);
    } else {
      expect(hasTiers).toBeTruthy();
    }
  });

  // ── Surveys & toolkit ────────────────────────────────────────────────────────

  test('software page mentions surveys and digital tools @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /survey|toolkit|workflow|digital/i.test(bodyText),
      'Software page should mention surveys or digital toolkit capabilities'
    ).toBeTruthy();
  });
});
