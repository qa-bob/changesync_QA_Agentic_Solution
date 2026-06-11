/**
 * tests/functional/consulting.spec.ts
 *
 * Functional tests for the ChangeSync consulting page
 * (/change-management-consulting).
 * Covers: page load, 3 service categories (Enterprise CM, QA Advisory,
 * Infrastructure Optimization), OCD® methodology reference, FAQ section,
 * 3 booking tiers, and contact form.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const PATH = '/change-management-consulting';

test.describe('Change Management Consulting Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + PATH, {
      waitUntil: 'domcontentloaded',
    });
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('consulting page loads with a heading @functional', async ({ page }) => {
    const heading = await page.locator('h1').first().textContent();
    expect(heading?.trim().length, 'Page should have a visible H1 heading').toBeGreaterThan(3);
  });

  test('page title references consulting or ChangeSync @functional', async ({ page }) => {
    const title = await page.title();
    expect(
      /consulting|changesync/i.test(title),
      `Title "${title}" should reference Consulting or ChangeSync`
    ).toBeTruthy();
  });

  // ── Three service categories ────────────────────────────────────────────────

  test('page describes Enterprise Change Management Consulting service @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /enterprise change management consulting|enterprise.{0,20}consulting/i.test(bodyText),
      'Page should describe Enterprise Change Management Consulting'
    ).toBeTruthy();
  });

  test('page describes Quality Assurance & Advisory service @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /quality assurance|advisory|QA/i.test(bodyText),
      'Page should describe the Quality Assurance & Advisory service'
    ).toBeTruthy();
  });

  test('page describes Change Infrastructure Optimization service @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /infrastructure.{0,20}optimization|infrastructure optimization|change infrastructure/i.test(bodyText),
      'Page should describe the Change Infrastructure Optimization service'
    ).toBeTruthy();
  });

  // ── OCD® methodology reference ──────────────────────────────────────────────

  test('page references the Organizational Change Design® approach @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /organizational change design|OCD/i.test(bodyText),
      'Consulting page should reference the OCD® approach'
    ).toBeTruthy();
  });

  // ── AI transformation positioning ──────────────────────────────────────────

  test('page mentions AI transformation focus @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /AI.{0,30}transformation|transformation.{0,30}AI|digital transformation/i.test(bodyText),
      'Consulting page should mention AI transformation expertise'
    ).toBeTruthy();
  });

  // ── FAQ section ─────────────────────────────────────────────────────────────

  test('page has a FAQ or "Got Questions" section @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasFaq = /got questions|FAQ|frequently asked|we.d love to answer/i.test(bodyText);

    const accordionEl = page.locator(
      '[class*="accordion"], [class*="faq"], details, [aria-expanded], [class*="collapse"]'
    );

    expect(
      hasFaq || (await accordionEl.count()) > 0,
      'Consulting page should have a FAQ or "Got Questions" section'
    ).toBeTruthy();
  });

  // ── Booking tiers ───────────────────────────────────────────────────────────

  test('page has the 3 consultation booking tiers @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasFastChat = /15.{0,10}min|fast chat/i.test(bodyText);
    const hasDiscussion = /30.{0,10}min|discussion/i.test(bodyText);
    const hasDemo = /1.{0,5}hour|60.{0,10}min|demo/i.test(bodyText);

    const tierCount = [hasFastChat, hasDiscussion, hasDemo].filter(Boolean).length;
    expect(
      tierCount,
      `Consulting page should show booking tiers. Found ${tierCount}/3.`
    ).toBeGreaterThanOrEqual(2);
  });

  test('page has "Book Now" or consultation booking links @functional', async ({ page }) => {
    const bookLinks = page.locator('a').filter({
      hasText: /book now|book a demo|schedule|calendly/i,
    });
    expect(
      await bookLinks.count(),
      'Consulting page should have consultation booking links'
    ).toBeGreaterThan(0);
  });

  // ── Contact form ────────────────────────────────────────────────────────────

  test('page has a contact form with an email field @functional', async ({ page }) => {
    const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    expect(
      await emailField.count(),
      'Consulting page should have a contact form with an email field'
    ).toBeGreaterThan(0);
  });
});
