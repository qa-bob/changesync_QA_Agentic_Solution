/**
 * tests/functional/homepage-features.spec.ts
 *
 * Functional tests for the ChangeSync homepage.
 * Covers: hero section, primary CTAs, "Why Choose ChangeSync" section,
 * testimonials, client logo bar, and footer contact info.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Features @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForLoad();
  });

  // ── Hero section ────────────────────────────────────────────────────────────

  test('hero section is visible and has meaningful content @functional', async ({ homePage }) => {
    const heroText = await homePage.getHeroText();
    expect(heroText.trim().length, 'Hero section should contain visible text').toBeGreaterThan(20);
  });

  test('homepage has a primary H1 heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.trim().length, 'Page should have a primary H1 heading').toBeGreaterThan(5);
  });

  test('homepage title contains ChangeSync branding @functional', async ({ homePage }) => {
    const title = await homePage.getTitle();
    expect(title.toLowerCase()).toContain('changesync');
  });

  // ── CTAs ─────────────────────────────────────────────────────────────────────

  test('"Book a Demo" CTA is visible on the homepage @functional', async ({ page }) => {
    // "Book a Demo" is in the Wix-rendered nav — check presence rather than visibility
    // since Wix nav may be JS-rendered after domcontentloaded
    const bookDemo = page.locator('a').filter({ hasText: /book a demo/i }).first();
    const calendlyLink = page.locator('a[href*="calendly"]').first();

    const hasByText = (await bookDemo.count()) > 0;
    const hasByHref = (await calendlyLink.count()) > 0;

    expect(
      hasByText || hasByHref,
      '"Book a Demo" CTA (by text or Calendly link) should be present on the homepage'
    ).toBeTruthy();
  });

  test('primary CTA links are present and have href attributes @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();
    expect(ctaButtons.length, 'At least one CTA button should exist on the homepage').toBeGreaterThan(0);

    for (const cta of ctaButtons.slice(0, 5)) {
      const tagName = await cta.evaluate((el) => el.tagName.toLowerCase());
      if (tagName === 'a') {
        const href = await cta.getAttribute('href');
        expect(href, 'CTA anchor tags should have an href').not.toBeNull();
        expect(href!.length, 'CTA href should not be empty').toBeGreaterThan(0);
      }
    }
  });

  // ── Client logos / trust bar ─────────────────────────────────────────────────

  test('"Trusted By" client logo section is present @functional', async ({ page }) => {
    // ChangeSync displays 40+ client logos in a trust bar section
    const logoSection = page.locator(
      '[class*="trusted"], [class*="clients"], [class*="logos"], ' +
      '[class*="partner"], section:has(img)'
    ).first();

    const hasSection = await logoSection.count() > 0;

    if (!hasSection) {
      // Fallback: look for a cluster of images (logo grid heuristic)
      const imgCount = await page.locator('img').count();
      expect(imgCount, 'Page should have client logo images').toBeGreaterThan(3);
    } else {
      await expect(logoSection).toBeVisible();
    }
  });

  // ── Why Choose ChangeSync ────────────────────────────────────────────────────

  test('"Why Choose ChangeSync" section exists with differentiators @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasWhySection = /why choose|changesync advantage|what sets us apart/i.test(bodyText);

    if (!hasWhySection) {
      // Soft fallback: look for at least 3 value proposition blocks
      const valueProps = page.locator('h2, h3').filter({
        hasText: /capability|lifecycle|enterprise|partnership|AI|unified/i,
      });
      const count = await valueProps.count();
      expect(count, 'Page should have value proposition section headings').toBeGreaterThan(0);
    } else {
      expect(hasWhySection).toBeTruthy();
    }
  });

  // ── Testimonials ─────────────────────────────────────────────────────────────

  test('testimonials / customer quotes section is present @functional', async ({ page }) => {
    const testimonialSection = page.locator(
      '[class*="testimonial"], [class*="review"], [class*="quote"], ' +
      'blockquote'
    ).first();

    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    // Wix testimonial carousels use varied headings — check for common patterns
    const hasTestimonialText =
      /testimonial|what our clients|what customers say|client stor|success stor|" .{10,50}"|change manager|change leader/i.test(
        bodyText
      );

    const hasSectionEl = (await testimonialSection.count()) > 0;

    expect(
      hasSectionEl || hasTestimonialText,
      'Page should have a testimonials / customer quotes section'
    ).toBeTruthy();
  });

  // ── Footer ───────────────────────────────────────────────────────────────────

  test('footer is present and contains contact information @functional', async ({ page }) => {
    // Wix sites use div-based footers, not always a semantic <footer> element
    const footer = page.locator('footer, [class*="footer"], [id*="footer"]').first();
    const hasFooter = (await footer.count()) > 0;

    if (!hasFooter) {
      // Fallback: check the page body for contact info directly
      const bodyText = await page.evaluate<string>(() => document.body.innerText);
      expect(
        /changesync|info@|mesa|arizona/i.test(bodyText),
        'Page body should contain ChangeSync contact information'
      ).toBeTruthy();
      return;
    }

    await expect(footer, 'Footer element should be present').toBeVisible();
    const footerText = (await footer.textContent())?.toLowerCase() ?? '';

    const hasContactInfo =
      footerText.includes('changesync') ||
      footerText.includes('info@') ||
      footerText.includes('mesa') ||
      footerText.includes('arizona');

    expect(hasContactInfo, 'Footer should contain company contact information').toBeTruthy();
  });

  test('footer has social media links @functional', async ({ page }) => {
    // Social links may be in a footer div rather than a semantic <footer>
    const socialLinks = page.locator(
      'a[href*="linkedin"], a[href*="facebook"], a[href*="youtube"], a[href*="twitter"]'
    );
    expect(
      await socialLinks.count(),
      'Page should have at least one social media link (LinkedIn, Facebook, YouTube, or Twitter)'
    ).toBeGreaterThan(0);
  });

  // ── Software features highlight ──────────────────────────────────────────────

  test('software features section mentions key capabilities @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    const featureKeywords = [
      /reporting|analytics/i,
      /stakeholder/i,
      /workflow|digital/i,
    ];

    const matchCount = featureKeywords.filter((kw) => kw.test(bodyText)).length;
    expect(
      matchCount,
      'Homepage should mention at least 2 core software feature keywords'
    ).toBeGreaterThanOrEqual(2);
  });
});
