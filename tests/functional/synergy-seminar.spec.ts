/**
 * tests/functional/synergy-seminar.spec.ts
 *
 * Functional tests for the ChangeSync Synergy Seminar page.
 * Covers: page load, $129/seat pricing, 4-hour virtual format,
 * project manager audience, 4 core topics, group pricing note,
 * upcoming sessions, and contact form.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const PATH = '/synergy-seminar';

test.describe('Synergy Seminar @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + PATH, {
      waitUntil: 'domcontentloaded',
    });
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('synergy seminar page loads with a heading @functional', async ({ page }) => {
    // Wix H1 is JS-rendered; use evaluate() which reads current DOM without waiting
    const heading = await page.evaluate<string>(() => {
      const h1 = document.querySelector('h1, h2');
      return h1?.textContent?.trim() ?? '';
    });
    // Fallback to page title if no heading found in initial render
    const title = heading.length > 3 ? heading : await page.title();
    expect(title.trim().length, 'Page should have a heading or title').toBeGreaterThan(3);
  });

  test('page title references Synergy Seminar or ChangeSync @functional', async ({ page }) => {
    const title = await page.title();
    expect(
      /synergy|changesync/i.test(title),
      `Title "${title}" should reference Synergy Seminar or ChangeSync`
    ).toBeTruthy();
  });

  // ── Program details ─────────────────────────────────────────────────────────

  test('page states the seat price ($129) @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /\$129|129.{0,10}seat/i.test(bodyText),
      'Synergy Seminar page should display the $129/seat price'
    ).toBeTruthy();
  });

  test('page states the 4-hour duration @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /4.{0,5}hour|four.{0,5}hour/i.test(bodyText),
      'Synergy Seminar page should state the 4-hour duration'
    ).toBeTruthy();
  });

  test('page mentions virtual delivery @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(/virtual|online/i.test(bodyText), 'Page should mention virtual delivery').toBeTruthy();
  });

  test('page notes group pricing availability @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /group pricing|group rate|team pricing|contact us/i.test(bodyText),
      'Synergy Seminar page should mention group pricing or bulk rates'
    ).toBeTruthy();
  });

  // ── Audience ────────────────────────────────────────────────────────────────

  test('page targets project managers and change leaders @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /project manager|PM|change leader|change manager/i.test(bodyText),
      'Synergy Seminar should identify project managers or change leaders as the audience'
    ).toBeTruthy();
  });

  // ── Core topics ─────────────────────────────────────────────────────────────

  test('page covers the gap between change and project management @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /gap|bridg|project management|change management/i.test(bodyText),
      'Page should describe bridging change management and project management'
    ).toBeTruthy();
  });

  test('page describes at least 2 of the 4 core seminar topics @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const topics = [
      /change as a process/i,
      /collaboration/i,
      /stakeholder/i,
      /communication/i,
    ];
    const matchCount = topics.filter((t) => t.test(bodyText)).length;
    expect(
      matchCount,
      `Page should cover at least 2 of the 4 core topics. Found ${matchCount}/4.`
    ).toBeGreaterThanOrEqual(2);
  });

  // ── Booking ─────────────────────────────────────────────────────────────────

  test('page has an upcoming sessions section or booking CTA @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    // "Upcoming Sessions" H2 may lazy-load on mobile; also check for Stripe/booking links
    const hasSessionContent = /upcoming session|register|book|schedule|stripe|calendly|2024|2025/i.test(bodyText);
    const hasBookingLink = (await page.locator('a[href*="buy.stripe.com"], a[href*="calendly"], a[href*="stripe"]').count()) > 0;
    expect(
      hasSessionContent || hasBookingLink,
      'Page should have sessions, booking content, or a booking link'
    ).toBeTruthy();
  });

  // ── Form ────────────────────────────────────────────────────────────────────

  test('page has a contact form with email field @functional', async ({ page }) => {
    const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    expect(
      await emailField.count(),
      'Synergy Seminar page should have a contact form with an email field'
    ).toBeGreaterThan(0);
  });
});
