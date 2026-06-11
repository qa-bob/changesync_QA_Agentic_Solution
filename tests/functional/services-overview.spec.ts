/**
 * tests/functional/services-overview.spec.ts
 *
 * Functional tests for ChangeSync service pages.
 * Covers: navigation to each service, page load verification,
 * and presence of key service content.
 *
 * ChangeSync services:
 *   - Masterclass Certification Program (/masterclass)
 *   - Leading Through Change (/leading-through-change)
 *   - Synergy Seminar (/synergy-seminar)
 *   - Organizational Change Design (/change-design)
 *   - Consulting (/change-management-consulting)
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';
import { ServicesPage, SERVICE_PATHS } from '@pages/services.page';

test.describe('Services Overview @functional', () => {
  // ── Navigation menu has all service links ────────────────────────────────────

  test('Services nav item is present in primary navigation @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const servicesLink = page.locator('nav a, [role="navigation"] a').filter({
      hasText: /^services$/i,
    }).first();

    if (await servicesLink.count() === 0) {
      // Services may be in the nav without being a standalone page link
      const navText = await page.locator('nav, [role="navigation"]').first().textContent();
      expect(
        navText?.toLowerCase(),
        'Navigation should contain a Services menu item'
      ).toContain('services');
    } else {
      await expect(servicesLink).toBeVisible();
    }
  });

  // ── Individual service pages ──────────────────────────────────────────────────

  test('Masterclass Certification Program page loads @functional', async ({ page, siteConfig }) => {
    const servicesPage = new ServicesPage(page, siteConfig);
    await servicesPage.navigateToService('masterclass');

    const response = await page.evaluate(() => performance.getEntriesByType('navigation')[0]);
    expect(response).not.toBeNull();

    const heading = await servicesPage.getPageHeading();
    expect(heading.length, 'Masterclass page should have a heading').toBeGreaterThan(3);
  });

  test('Leading Through Change page loads @functional', async ({ page, siteConfig }) => {
    const servicesPage = new ServicesPage(page, siteConfig);
    await servicesPage.navigateToService('leadingThroughChange');

    const heading = await servicesPage.getPageHeading();
    expect(heading.length, 'Leading Through Change page should have a heading').toBeGreaterThan(3);
  });

  test('Organizational Change Design page loads @functional', async ({ page, siteConfig }) => {
    const servicesPage = new ServicesPage(page, siteConfig);
    await servicesPage.navigateToService('changeDesign');

    const heading = await servicesPage.getPageHeading();
    expect(heading.length, 'Change Design page should have a heading').toBeGreaterThan(3);

    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /change design|organizational change|framework/i.test(bodyText),
      'Change Design page should describe the OCD framework'
    ).toBeTruthy();
  });

  test('Consulting page loads @functional', async ({ page, siteConfig }) => {
    const servicesPage = new ServicesPage(page, siteConfig);
    await servicesPage.navigateToService('consulting');

    const heading = await servicesPage.getPageHeading();
    expect(heading.length, 'Consulting page should have a heading').toBeGreaterThan(3);
  });

  // ── Service pages have CTA ───────────────────────────────────────────────────

  test('Masterclass page has at least one CTA @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + SERVICE_PATHS.masterclass, {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });
    const cta = page.locator('a, button').filter({
      hasText: /book|demo|contact|learn more|get started|schedule|enroll|register/i,
    }).first();
    expect(await cta.count(), 'Masterclass page should have at least one CTA').toBeGreaterThan(0);
  });

  test('Change Design page has at least one CTA @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + SERVICE_PATHS.changeDesign, {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });
    const cta = page.locator('a, button').filter({
      hasText: /book|demo|contact|learn more|get started|schedule|enroll|register/i,
    }).first();
    expect(await cta.count(), 'Change Design page should have at least one CTA').toBeGreaterThan(0);
  });

  test('Consulting page has at least one CTA @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + SERVICE_PATHS.consulting, {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });
    const cta = page.locator('a, button').filter({
      hasText: /book|demo|contact|learn more|get started|schedule|enroll|register/i,
    }).first();
    expect(await cta.count(), 'Consulting page should have at least one CTA').toBeGreaterThan(0);
  });

  // ── Homepage service highlights ──────────────────────────────────────────────

  test('homepage lists multiple ChangeSync services @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    const serviceKeywords = [
      /masterclass|certification/i,
      /consulting/i,
      /software|platform/i,
    ];

    const matchCount = serviceKeywords.filter((kw) => kw.test(bodyText)).length;
    expect(
      matchCount,
      'Homepage should reference at least 2 ChangeSync services'
    ).toBeGreaterThanOrEqual(2);
  });
});
