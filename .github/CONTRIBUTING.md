# Contributing to ChangeSync QA

Thank you for contributing! This guide covers the workflow and conventions for adding or updating tests.

---

## Getting Set Up

Full setup instructions are in the [README](../README.md). Quick start:

```bash
npm install
npx playwright install --with-deps
npm run typecheck   # must pass before any PR
npm run test:smoke  # quick sanity check
```

---

## Branching Strategy

| Pattern | Use for |
|---------|---------|
| `feat/<ticket>-<description>` | New test suites, new POM classes |
| `fix/<ticket>-<description>` | Broken selectors, flaky test fixes |
| `chore/<description>` | Config, dependency, tooling changes |

All PRs target `main`. Do not push directly to `main`.

---

## Page Object Model Rules

Every page tested must have a POM class in `src/pages/`:

- **Locators** belong in the page object as `readonly Locator` properties
- **Actions** belong in the page object as `async` methods (e.g., `clickBookDemo()`)
- **Assertions** belong in the test file only — never in a page object
- No `expect()` calls inside page objects
- No `page.waitForTimeout()` over 500ms without an explanatory comment
- All new page classes must extend `BasePage`

---

## Test Tagging

Every test must have at least one tag:

| Tag | Use for |
|-----|---------|
| `@smoke` | Is the site up? Does it load? |
| `@navigation` | Links, menus, routing |
| `@forms` | Form fields, validation (no submission) |
| `@functional` | Business features, user flows |
| `@visual` | Screenshot regression |
| `@responsive` | Layout at mobile / tablet / desktop |

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(functional): add software page feature tests
fix(navigation): update mobile menu toggle selector
chore: bump @playwright/test to 1.45
docs: add setup instructions for Windows
```

---

## PR Checklist

Before opening a PR, confirm:

- [ ] `npm run typecheck` passes (zero errors)
- [ ] `npm run lint` passes
- [ ] `npm run test:smoke` passes locally
- [ ] All new tests are tagged with at least one `@tag`
- [ ] Page objects are added or updated for any new selectors
- [ ] Visual baselines refreshed if layout changed (`npm run baseline`)
- [ ] PR description explains what changed and why

---

## What NOT to Do

- Submit any form in a test
- Hardcode `https://changesync.com` — use `baseURL` or `siteConfig.url`
- Add `any` types without a justification comment
- Put assertions (`expect()`) inside page object methods
- Create accounts or enter real credentials
- Use `page.waitForTimeout()` as a substitute for proper waits

---

## Getting Help

- Open a GitHub Issue using a template in `.github/ISSUE_TEMPLATE/`
- Contact: rosmall@teksystems.com
