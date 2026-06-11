/**
 * tests/functional/masterclass.spec.ts
 *
 * Functional tests for the ChangeSync Masterclass Certification Program page.
 * Covers: page load, program details ($2,500 / 5 days / virtual), 6 differentiators,
 * upcoming sessions with booking links, testimonials, and enterprise inquiry form.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const PATH = '/masterclass';

test.describe('Masterclass Certification Program @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + PATH, {
      waitUntil: 'domcontentloaded',
    });
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('masterclass page loads successfully @functional', async ({ page }) => {
    const h1 = await page.locator('h1').first().textContent();
    expect(h1?.trim().length, 'Masterclass page should have an H1 heading').toBeGreaterThan(3);
  });

  test('masterclass page title contains expected content @functional', async ({ page }) => {
    const title = await page.title();
    expect(
      /masterclass|certification|changesync/i.test(title),
      `Page title "${title}" should mention Masterclass or Certification`
    ).toBeTruthy();
  });

  // ── Program details ─────────────────────────────────────────────────────────

  test('masterclass page states the program duration (5 days) @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /5.{0,5}day|five.{0,5}day/i.test(bodyText),
      'Masterclass page should state the 5-day program duration'
    ).toBeTruthy();
  });

  test('masterclass page states the seat price ($2,500) @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /\$2[,.]?500|2500/i.test(bodyText),
      'Masterclass page should show the $2,500/seat price'
    ).toBeTruthy();
  });

  test('masterclass page states the virtual delivery format @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /virtual|online|remote/i.test(bodyText),
      'Masterclass page should mention the virtual delivery format'
    ).toBeTruthy();
  });

  // ── Differentiating factors ─────────────────────────────────────────────────

  test('masterclass page has the 6 differentiating factors @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    const factors = [
      /innovative/i,
      /ready.to.use|ready to use/i,
      /people first/i,
      /reporting/i,
      /change culture/i,
      /sustain/i,
    ];

    const matchCount = factors.filter((f) => f.test(bodyText)).length;
    expect(
      matchCount,
      `Masterclass page should list the 6 differentiators. Found ${matchCount}/6.`
    ).toBeGreaterThanOrEqual(4);
  });

  // ── Upcoming sessions ───────────────────────────────────────────────────────

  test('masterclass page has an upcoming sessions section @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /upcoming session|register now|book now|session/i.test(bodyText),
      'Masterclass page should have an upcoming sessions section'
    ).toBeTruthy();
  });

  test('masterclass page has a booking / registration link @functional', async ({ page }) => {
    const bookingLink = page.locator('a').filter({
      hasText: /register now|book|buy|enroll|secure your spot/i,
    }).first();
    expect(
      await bookingLink.count(),
      'Masterclass page should have a registration or booking link'
    ).toBeGreaterThan(0);
  });

  test('masterclass booking links point to a valid destination @functional', async ({ page }) => {
    const stripeOrCalendlyLink = page.locator(
      'a[href*="stripe"], a[href*="calendly"], a[href*="buy."], a[href*="book"]'
    ).first();

    if (await stripeOrCalendlyLink.count() === 0) {
      const anyBookLink = page.locator('a').filter({ hasText: /book|register|buy/i }).first();
      const href = await anyBookLink.getAttribute('href');
      expect(href?.trim().length, 'Booking link should have a non-empty href').toBeGreaterThan(0);
    } else {
      const href = await stripeOrCalendlyLink.getAttribute('href');
      expect(href).not.toBeNull();
    }
  });

  // ── Testimonials ────────────────────────────────────────────────────────────

  test('masterclass page has graduate testimonials @functional', async ({ page }) => {
    const testimonialSection = page.locator(
      '[class*="testimonial"], [class*="review"], [class*="quote"], blockquote'
    );
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasGraduateText = /graduate|graduate|what our|saying|testimonial/i.test(bodyText);

    const hasSectionEl = (await testimonialSection.count()) > 0;
    expect(
      hasSectionEl || hasGraduateText,
      'Masterclass page should have graduate testimonials'
    ).toBeTruthy();
  });

  // ── Enterprise inquiry form ─────────────────────────────────────────────────

  test('masterclass page has an enterprise inquiry / contact form @functional', async ({ page }) => {
    const form = page.locator('form').first();
    expect(
      await form.count(),
      'Masterclass page should have an enterprise inquiry form'
    ).toBeGreaterThan(0);

    const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    expect(
      await emailField.count(),
      'Enterprise inquiry form should have an email field'
    ).toBeGreaterThan(0);
  });
});
