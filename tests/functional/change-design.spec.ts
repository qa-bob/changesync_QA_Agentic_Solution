/**
 * tests/functional/change-design.spec.ts
 *
 * Functional tests for the ChangeSync Organizational Change Design® page.
 * Covers: page load, OCD® framework (5 components), 7-step methodology,
 * 5 organizational outcomes, FAQ accordion section, contact form,
 * and booking tier options.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const PATH = '/change-design';

test.describe('Organizational Change Design® Page @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + PATH, {
      waitUntil: 'domcontentloaded',
    });
  });

  // ── Page load ───────────────────────────────────────────────────────────────

  test('change design page loads with a heading @functional', async ({ page }) => {
    const heading = await page.locator('h1').first().textContent();
    expect(heading?.trim().length, 'Page should have a visible H1 heading').toBeGreaterThan(3);
  });

  test('page title references Organizational Change Design or ChangeSync @functional', async ({ page }) => {
    const title = await page.title();
    expect(
      /change design|organizational|changesync/i.test(title),
      `Title "${title}" should reference OCD or ChangeSync`
    ).toBeTruthy();
  });

  // ── OCD® trademark ──────────────────────────────────────────────────────────

  test('page mentions Organizational Change Design® @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /organizational change design/i.test(bodyText),
      'Page should mention Organizational Change Design®'
    ).toBeTruthy();
  });

  // ── Framework components ────────────────────────────────────────────────────

  test('page describes at least 3 of the 5 OCD framework components @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const components = [
      /leadership alignment/i,
      /governance/i,
      /portfolio management/i,
      /workforce readiness|workforce/i,
      /data.{0,10}tools|measurement/i,
    ];
    const matchCount = components.filter((c) => c.test(bodyText)).length;
    expect(
      matchCount,
      `Page should describe at least 3/5 OCD framework components. Found ${matchCount}.`
    ).toBeGreaterThanOrEqual(3);
  });

  // ── Methodology ────────────────────────────────────────────────────────────

  test('page describes the "How it works" methodology @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /how it works|methodology|approach|step/i.test(bodyText),
      'Page should describe the OCD methodology or "How it works" section'
    ).toBeTruthy();
  });

  test('page mentions assessing capability or defining operating model @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /assess|operating model|center of excellence|capability/i.test(bodyText),
      'Page should reference capability assessment or operating model design'
    ).toBeTruthy();
  });

  // ── Outcomes ───────────────────────────────────────────────────────────────

  test('page describes measurable organizational outcomes @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const outcomes = [
      /success rate|transformation success/i,
      /AI.{0,20}adoption|digital adoption/i,
      /change fatigue/i,
      /visibility|risk management/i,
      /scalable|capability/i,
    ];
    const matchCount = outcomes.filter((o) => o.test(bodyText)).length;
    expect(
      matchCount,
      `Page should describe at least 2/5 organizational outcomes. Found ${matchCount}.`
    ).toBeGreaterThanOrEqual(2);
  });

  // ── FAQ / accordion ─────────────────────────────────────────────────────────

  test('page has a FAQ or "Got Questions" section @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasFaq = /got questions|FAQ|frequently asked|we.d love to answer/i.test(bodyText);

    const accordionEl = page.locator(
      '[class*="accordion"], [class*="faq"], details, [data-toggle], ' +
      '[aria-expanded], [class*="collapse"]'
    );

    expect(
      hasFaq || (await accordionEl.count()) > 0,
      'Page should have a FAQ or "Got Questions" section'
    ).toBeTruthy();
  });

  // ── Booking tiers ───────────────────────────────────────────────────────────

  test('page offers booking / consultation options @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasTiers =
      /15.{0,10}min|fast chat|30.{0,10}min|discussion|1.{0,5}hour|demo/i.test(bodyText);

    if (!hasTiers) {
      const bookCTA = page.locator('a, button').filter({ hasText: /book|demo|consult|contact/i }).first();
      expect(
        await bookCTA.count(),
        'Page should have a booking or consultation CTA'
      ).toBeGreaterThan(0);
    } else {
      expect(hasTiers).toBeTruthy();
    }
  });

  // ── Contact form ────────────────────────────────────────────────────────────

  test('page has a contact form with an email field @functional', async ({ page }) => {
    const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    expect(
      await emailField.count(),
      'Change Design page should have a contact form with an email field'
    ).toBeGreaterThan(0);
  });
});
