/**
 * tests/smoke/legal-pages.spec.ts
 *
 * Smoke tests for legal / policy pages linked in the ChangeSync footer.
 * Verifies they exist, return a successful HTTP response, and have a title.
 *
 * Tag: @smoke
 */

import { test, expect } from '@fixtures/site.fixture';

const LEGAL_PAGES: Array<{ name: string; path: string }> = [
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms and Conditions', path: '/terms-and-conditions' },
];

test.describe('Legal Pages @smoke', () => {
  for (const { name, path } of LEGAL_PAGES) {
    test(`${name} page loads and returns a success response @smoke`, async ({ page, siteConfig }) => {
      const response = await page.goto(siteConfig.url.replace(/\/$/, '') + path, {
        waitUntil: 'domcontentloaded',
        timeout: 15_000,
      });

      expect(response, `${name} page should return a response`).not.toBeNull();
      const status = response!.status();
      expect(
        status >= 200 && status < 400,
        `${name} (${path}) returned HTTP ${status} — expected 2xx/3xx`
      ).toBeTruthy();
    });

    test(`${name} page has a non-empty title @smoke`, async ({ page, siteConfig }) => {
      await page.goto(siteConfig.url.replace(/\/$/, '') + path, {
        waitUntil: 'domcontentloaded',
        timeout: 15_000,
      });

      const title = await page.title();
      expect(title.trim().length, `${name} page should have a non-empty <title>`).toBeGreaterThan(3);
    });
  }

  test('footer contains links to Privacy Policy and Terms @smoke', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    const footer = page.locator('footer, [class*="footer"], [id*="footer"]').first();
    await expect(footer).toBeVisible();

    // Scope to the footer if found, otherwise fall back to full page
    const scope = (await footer.count()) > 0 ? footer : page.locator('body');
    const privacyLink = scope.locator('a[href*="privacy"]');
    const termsLink = scope.locator('a[href*="terms"]');

    expect(
      await privacyLink.count(),
      'Footer should link to the Privacy Policy page'
    ).toBeGreaterThan(0);

    expect(
      await termsLink.count(),
      'Footer should link to the Terms and Conditions page'
    ).toBeGreaterThan(0);
  });
});
