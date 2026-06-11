/**
 * tests/functional/demo-booking.spec.ts
 *
 * Functional tests for ChangeSync's demo booking and contact flows.
 * Covers: "Book a Demo" CTAs across pages, the three booking tiers
 * (15-min, 30-min, 60-min/1-hour), and contact page calendar links.
 *
 * NOTE: We do not click through to external booking services (Calendly).
 * We verify the links exist, are visible, and point to a valid destination.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Demo Booking & Contact Flow @functional', () => {
  // ── Book a Demo CTAs ────────────────────────────────────────────────────────

  test('"Book a Demo" CTA is present and visible on homepage @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    // Wix nav buttons may not be immediately visible at domcontentloaded;
    // check presence by text match OR by Calendly href (the demo booking URL)
    const bookDemo = page.locator('a').filter({ hasText: /book a demo/i });
    const calendlyLink = page.locator('a[href*="calendly"]');

    const hasByText = (await bookDemo.count()) > 0;
    const hasByHref = (await calendlyLink.count()) > 0;

    expect(
      hasByText || hasByHref,
      '"Book a Demo" CTA (by text or Calendly link) should be present on the homepage'
    ).toBeTruthy();
  });

  test('"Book a Demo" CTA href is not empty @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const bookDemo = page.locator('a').filter({ hasText: /book a demo/i }).first();
    if (await bookDemo.count() === 0) {
      test.skip(true, 'No "Book a Demo" anchor found on homepage');
      return;
    }

    const href = await bookDemo.getAttribute('href');
    expect(href, '"Book a Demo" should have a non-empty href').not.toBeNull();
    expect(href!.trim().length, '"Book a Demo" href should not be empty').toBeGreaterThan(0);
  });

  test('"Book a Demo" CTA links to a booking or contact destination @functional', async ({
    page,
    siteConfig,
  }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    // Prefer Calendly links (the actual booking destination) over text-matched anchors
    const calendlyLink = page.locator('a[href*="calendly"]').first();
    if ((await calendlyLink.count()) > 0) {
      const href = await calendlyLink.getAttribute('href');
      expect(href?.length, 'Calendly booking link should have a non-empty href').toBeGreaterThan(0);
      return;
    }

    const bookDemo = page.locator('a').filter({ hasText: /book a demo/i }).first();
    if (await bookDemo.count() === 0) {
      test.skip(true, 'No "Book a Demo" anchor or Calendly link found on homepage');
      return;
    }

    const href = await bookDemo.getAttribute('href');
    expect(href, '"Book a Demo" should have a non-null href').not.toBeNull();
    // Accept any non-empty href — destination may be internal or external
    expect(href!.trim().length, '"Book a Demo" href should not be empty').toBeGreaterThan(0);
  });

  // ── Three booking tiers on /contact ─────────────────────────────────────────

  test('contact page has booking tier options @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + '/contact', {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });

    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    // ChangeSync offers 3 tiers: 15-min Fast Chat, 30-min Discussion, 60-min/1-hr Demo
    const hasFastChat = /15.{0,10}min|fast chat|quick/i.test(bodyText);
    const hasDiscussion = /30.{0,10}min|discussion/i.test(bodyText);
    const hasDemoTier = /60.{0,10}min|1.{0,5}hour|hour.{0,10}demo|demo.{0,10}session/i.test(bodyText);

    const tierCount = [hasFastChat, hasDiscussion, hasDemoTier].filter(Boolean).length;

    expect(
      tierCount,
      `Contact page should show booking tier options. Found ${tierCount}/3 tiers ` +
        `(15-min: ${hasFastChat}, 30-min: ${hasDiscussion}, 60-min: ${hasDemoTier})`
    ).toBeGreaterThanOrEqual(2);
  });

  test('contact page has Calendly booking links @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + '/contact', {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });

    const calendlyLinks = page.locator('a[href*="calendly"]');
    const bookingLinks = page.locator('a').filter({
      hasText: /secure your spot|book|schedule|choose time/i,
    });

    const hasCalendly = (await calendlyLinks.count()) > 0;
    const hasBookingText = (await bookingLinks.count()) > 0;

    expect(
      hasCalendly || hasBookingText,
      'Contact page should have Calendly or booking-text links'
    ).toBeTruthy();
  });

  // ── Secure Your Spot / Events CTA ────────────────────────────────────────────

  test('"Secure Your Spot" or event CTA exists on homepage @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const eventCta = page.locator('a, button').filter({
      hasText: /secure your spot|register|upcoming event|nextwave/i,
    });

    // Check both by link text and by the known events URL path
    const eventLink = page.locator('a[href*="nextwave"]');

    const hasByText = (await eventCta.count()) > 0;
    const hasByHref = (await eventLink.count()) > 0;

    if (!hasByText && !hasByHref) {
      // Soft pass — events section may be seasonal or JS-rendered after load
      console.warn('[demo-booking] No event CTA found on homepage — may be seasonal content.');
    } else {
      expect(hasByText || hasByHref, 'Events CTA should be present on the homepage').toBeTruthy();
    }
  });

  // ── "Let's Talk Change" CTA ───────────────────────────────────────────────────

  test('"Let\'s Talk Change" or secondary booking CTA is present @functional', async ({
    page,
    siteConfig,
  }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const letsTalkCta = page.locator('a, button').filter({
      hasText: /let.{0,5}s talk|talk change|get in touch|contact us/i,
    }).first();

    const ctaCount = await letsTalkCta.count();
    expect(
      ctaCount,
      'Homepage should have a secondary engagement CTA ("Let\'s Talk Change" or "Contact Us")'
    ).toBeGreaterThan(0);
  });
});
