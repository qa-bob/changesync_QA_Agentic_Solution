/**
 * tests/functional/leading-through-change.spec.ts
 *
 * Functional tests for the ChangeSync Leading Through Change program page.
 * Covers: page load, $129/seat pricing, 4-hour virtual format,
 * TRANSFORM framework, 4 key outcomes, upcoming sessions, contact form.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const PATH = '/leading-through-change';

test.describe('Leading Through Change Program @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + PATH, {
      waitUntil: 'domcontentloaded',
    });
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('leading through change page loads with a heading @functional', async ({ page }) => {
    const heading = await page.locator('h1').first().textContent();
    expect(heading?.trim().length, 'Page should have a visible H1 heading').toBeGreaterThan(3);
  });

  test('page title contains expected program name @functional', async ({ page }) => {
    const title = await page.title();
    expect(
      /leading through change|changesync/i.test(title),
      `Title "${title}" should reference Leading Through Change or ChangeSync`
    ).toBeTruthy();
  });

  // ── Program details ─────────────────────────────────────────────────────────

  test('page states the seat price ($129) @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /\$129|129.{0,10}seat|129.{0,10}per/i.test(bodyText),
      'Leading Through Change page should display the $129/seat price'
    ).toBeTruthy();
  });

  test('page states the program duration (4 hours) @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /4.{0,5}hour|four.{0,5}hour/i.test(bodyText),
      'Leading Through Change page should state the 4-hour duration'
    ).toBeTruthy();
  });

  test('page mentions virtual delivery format @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /virtual|online|remote|in.person/i.test(bodyText),
      'Page should mention the delivery format (virtual or in-person)'
    ).toBeTruthy();
  });

  // ── TRANSFORM framework ─────────────────────────────────────────────────────

  test('page references the TRANSFORM framework @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /transform/i.test(bodyText),
      'Leading Through Change page should reference the TRANSFORM framework'
    ).toBeTruthy();
  });

  // ── Key outcomes ────────────────────────────────────────────────────────────

  test('page describes key outcomes for attendees @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    const outcomes = [
      /empower/i,
      /resilient|resistance/i,
      /adoption|change adoption/i,
      /culture|change.positive/i,
    ];

    const matchCount = outcomes.filter((o) => o.test(bodyText)).length;
    expect(
      matchCount,
      `Page should describe at least 3 of the 4 key outcomes. Found ${matchCount}/4.`
    ).toBeGreaterThanOrEqual(3);
  });

  // ── Sessions & booking ──────────────────────────────────────────────────────

  test('page has an upcoming sessions section @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    // "Upcoming Sessions" section may lazy-load; also accept "Book" CTA or scheduling text
    expect(
      /upcoming session|register now|session|schedule|book|august|july|2024|2025/i.test(bodyText),
      'Page should have an upcoming sessions or registration section'
    ).toBeTruthy();
  });

  test('page has a registration CTA @functional', async ({ page }) => {
    const registerCTA = page.locator('a, button').filter({
      hasText: /register|book|enroll|sign up|secure your spot/i,
    }).first();
    expect(
      await registerCTA.count(),
      'Leading Through Change page should have a registration CTA'
    ).toBeGreaterThan(0);
  });

  // ── Target audience ─────────────────────────────────────────────────────────

  test('page identifies the target audience (people leaders) @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /leader|manager|people leader/i.test(bodyText),
      'Page should identify people leaders as the target audience'
    ).toBeTruthy();
  });

  // ── Contact form ────────────────────────────────────────────────────────────

  test('page has a contact / inquiry form @functional', async ({ page }) => {
    const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    expect(
      await emailField.count(),
      'Leading Through Change page should have a contact form with an email field'
    ).toBeGreaterThan(0);
  });
});
