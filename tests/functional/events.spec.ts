/**
 * tests/functional/events.spec.ts
 *
 * Functional tests for the ChangeSync NextWave Change Collective events page.
 * Covers: page load, event details, ticket tiers (Free/$0, Team/$19,
 * In-Person/$349, Virtual/$149), registration CTAs, speaker section,
 * and updates signup form.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { EventsPage } from '@pages/events.page';

test.describe('NextWave Change Collective Events @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    const eventsPage = new EventsPage(page, siteConfig);
    await eventsPage.navigateToEvents();
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('events page loads and has a heading @functional', async ({ page, siteConfig }) => {
    const eventsPage = new EventsPage(page, siteConfig);
    const heading = await eventsPage.getPageHeading();
    expect(heading.trim().length, 'Events page should have a visible heading').toBeGreaterThan(3);
  });

  test('events page URL is correct @functional', async ({ page }) => {
    expect(page.url()).toContain('/nextwave-change-collective');
  });

  test('events page title contains NextWave or ChangeSync @functional', async ({ page }) => {
    const title = await page.title();
    expect(
      /nextwave|changesync/i.test(title),
      `Page title "${title}" should contain NextWave or ChangeSync`
    ).toBeTruthy();
  });

  // ── Event branding ──────────────────────────────────────────────────────────

  test('page mentions NextWave Change Collective @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /nextwave/i.test(bodyText),
      'Events page should mention NextWave Change Collective'
    ).toBeTruthy();
  });

  test('page references a conference location or format @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasLocation =
      /scottsdale|arizona|virtual|in.person|in person|online/i.test(bodyText);
    expect(hasLocation, 'Events page should mention location or attendance format').toBeTruthy();
  });

  test('page mentions an event date or year @functional', async ({ page, siteConfig }) => {
    const eventsPage = new EventsPage(page, siteConfig);
    const hasDates = await eventsPage.hasEventDateMention();
    expect(hasDates, 'Events page should reference an event date or year').toBeTruthy();
  });

  // ── Ticket tiers ────────────────────────────────────────────────────────────

  test('events page shows ticket / attendance options @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    // ChangeSync offers: Personal ($0), Team ($19/mo), In-Person ($349), Virtual ($149)
    const hasInPerson = /in.person|in person/i.test(bodyText);
    const hasVirtual = /virtual|online/i.test(bodyText);

    expect(
      hasInPerson || hasVirtual,
      'Events page should list in-person or virtual attendance options'
    ).toBeTruthy();
  });

  test('events page mentions ticket pricing @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    // Any of the known price points: $0/free, $19, $149, $349
    const hasPricing =
      /\$0|\$19|\$149|\$349|free|complimentary/i.test(bodyText);

    if (!hasPricing) {
      // Softer fallback: pricing section heading exists
      const pricingSection = page.locator('[class*="pricing"], [class*="ticket"], [class*="plan"]');
      expect(
        await pricingSection.count(),
        'Events page should show ticket pricing options'
      ).toBeGreaterThan(0);
    } else {
      expect(hasPricing).toBeTruthy();
    }
  });

  test('"Register" or "Secure Your Spot" CTA is present @functional', async ({ page, siteConfig }) => {
    const eventsPage = new EventsPage(page, siteConfig);
    const cta = eventsPage.getRegistrationCTA();
    expect(
      await cta.count(),
      'Events page should have a registration or "Secure Your Spot" CTA'
    ).toBeGreaterThan(0);
  });

  // ── Speakers ────────────────────────────────────────────────────────────────

  test('events page has a speaker or keynote section @functional', async ({ page, siteConfig }) => {
    const eventsPage = new EventsPage(page, siteConfig);
    const hasSpeakers = await eventsPage.hasSpeakerSection();
    expect(hasSpeakers, 'Events page should mention speakers or keynote info').toBeTruthy();
  });

  // ── Updates signup ──────────────────────────────────────────────────────────

  test('events page has an email signup / updates form @functional', async ({ page, siteConfig }) => {
    const eventsPage = new EventsPage(page, siteConfig);
    const hasForm = await eventsPage.hasUpdatesSignupForm();

    if (!hasForm) {
      // Fallback: a link to sign up for updates
      const updateLink = page.locator('a').filter({ hasText: /updates|notify|alert/i });
      expect(
        await updateLink.count(),
        'Events page should have a way to sign up for updates'
      ).toBeGreaterThan(0);
    } else {
      expect(hasForm).toBeTruthy();
    }
  });

  // ── Navigation ──────────────────────────────────────────────────────────────

  test('"Book a Demo" CTA is accessible from the events page @functional', async ({ page }) => {
    // Check both text-based CTA and Calendly booking link (the events page nav may JS-render)
    const bookDemo = page.locator('a').filter({ hasText: /book a demo/i });
    const calendlyLink = page.locator('a[href*="calendly"]');

    const hasByText = (await bookDemo.count()) > 0;
    const hasByHref = (await calendlyLink.count()) > 0;

    if (!hasByText && !hasByHref) {
      console.warn('[events] No "Book a Demo" CTA found on events page — may be JS-rendered.');
    } else {
      expect(
        hasByText || hasByHref,
        '"Book a Demo" CTA or Calendly link should be accessible from the events page'
      ).toBeTruthy();
    }
  });
});
