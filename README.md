# ChangeSync — QA Agentic Solution

> Automated GUI, functional, and regression test suite for [changesync.com](https://changesync.com) built with **Playwright + TypeScript** using a **Page Object Model (POM)** architecture. Powered by **Claude Code** agentic execution.

---

## What This Repo Tests

[ChangeSync](https://changesync.com) is an enterprise change management software and consulting platform. This repo validates the following areas end-to-end:

| Area | Tag | Coverage |
|------|-----|---------|
| Availability | `@smoke` | Site loads, HTTPS, HTTP status, page title, JS errors |
| Navigation | `@navigation` | All nav links resolve, mobile menu, logo link, a11y text |
| Forms | `@forms` | Fields present, required validation, submit button, labels |
| Business Features | `@functional` | Hero CTAs, software features, services, about, demo booking |
| Visual Regression | `@visual` | Pixel-diff screenshots at desktop / mobile / tablet |
| Responsive Layout | `@responsive` | No overflow, text readable, viewport meta, alt attributes |

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | ^1.44 | Browser automation — Chromium, mobile Chrome, tablet |
| TypeScript | ^5.4 | Strongly-typed test code (`strict: true`) |
| ESLint + `@typescript-eslint` | ^8 / ^7 | Code quality |
| GitHub Actions | — | CI pipeline — runs on every push and PR |
| Claude Code | latest | Agentic test generation, analysis, and maintenance |

---

## Prerequisites

- **Node.js** ≥ 18.x (`node -v`)
- **npm** ≥ 9.x (`npm -v`)
- **Claude Code** CLI for agentic commands (`claude --version`)

---

## Development Environment Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd changesync_QA_Agentic_Solution

# 2. Install Node dependencies
npm install

# 3. Install Playwright browser binaries
npx playwright install --with-deps

# 4. Verify TypeScript compiles cleanly (must be zero errors)
npm run typecheck

# 5. Run the smoke suite to confirm the environment works
npm run test:smoke
```

### Environment Variables

Copy `.env.example` to `.env.local` if you need to override defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `SITE_URL` | value from `site.config.json` | Override target URL without editing config |
| `CI` | unset | Set to `1` in CI — enables retries and stricter worker limits |

---

## Running Tests

```bash
npm test                    # Full suite across all browsers
npm run test:smoke          # @smoke — fast availability check (run first)
npm run test:navigation     # @navigation — links, routing, mobile menu
npm run test:forms          # @forms — form fields and validation
npm run test:functional     # @functional — business feature flows
npm run test:visual         # @visual — screenshot regression
npm run test:responsive     # @responsive — layout at all viewports
npm run test:headed         # Open a browser window while tests run
npm run report              # Open the last HTML report in a browser
npm run baseline            # Capture / refresh visual regression baselines
npm run lint                # ESLint
npm run typecheck           # TypeScript check (no emit)
```

### Running a Single Test File

```bash
npx playwright test tests/smoke/site-availability.spec.ts
```

### Running Against a Different URL

```bash
SITE_URL=https://staging.changesync.com npm test
```

---

## Architecture: Page Object Model (POM) + OOP

Every page or major section has a dedicated POM class in `src/pages/` that extends `BasePage`.

```
src/pages/
  base.page.ts          BasePage — shared helpers (navigate, screenshot, layout checks)
  home.page.ts          HomePage — hero text, CTAs, headings
  navigation.page.ts    NavigationPage — nav links, mobile menu, link reachability
  contact.page.ts       ContactFormPage — form fields, labels, validation state
  software.page.ts      SoftwarePage — feature grid, demo CTAs, compliance badges
  services.page.ts      ServicesPage — service listings, individual service links
  about.page.ts         AboutPage — team section, company stats, mission
  blog.page.ts          BlogPage — article list, pagination, search
```

**OOP Design Principles Applied:**

| Principle | Implementation |
|-----------|---------------|
| Inheritance | All page classes extend `BasePage` |
| Encapsulation | Locators and actions hidden inside the class; tests call methods, not selectors |
| Single Responsibility | One class per page / section; one spec file per feature area |
| Open/Closed | New pages extend `BasePage` without modifying it |

**Rules:**
- Locators are `readonly Locator` properties on the class
- Methods represent user actions, not assertions (`async clickBookDemo()`)
- No `expect()` inside page objects — assertions belong in test files only
- Fixtures in `src/fixtures/site.fixture.ts` wire up page objects and config

---

## Repository Structure

```
changesync_QA_Agentic_Solution/
├── .claude/
│   ├── agents/
│   │   ├── site-analyzer.md         Claude sub-agent: crawl site → site.config.json
│   │   └── test-generator.md        Claude sub-agent: config → test files
│   ├── commands/
│   │   ├── analyze-site.md          /analyze-site slash command
│   │   ├── generate-report.md       /generate-report slash command
│   │   ├── run-smoke.md             /run-smoke slash command
│   │   └── update-baseline.md       /update-baseline slash command
│   └── hooks/
│       └── pre-test.sh              Pre-test hook (reachability check)
├── .github/
│   ├── CONTRIBUTING.md              Contribution guide
│   ├── PULL_REQUEST_TEMPLATE.md     PR checklist
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md            Bug report template
│   │   └── test_request.md          Test coverage request template
│   └── workflows/
│       └── playwright.yml           CI pipeline
├── src/
│   ├── fixtures/
│   │   └── site.fixture.ts          Custom Playwright fixtures (page objects + config)
│   ├── pages/                       Page Object Model classes
│   ├── types/
│   │   └── site-config.types.ts     SiteConfig TypeScript interface
│   └── utils/
│       ├── link-checker.ts          HTTP link reachability helper
│       └── visual-helper.ts         Cookie banner dismissal, screenshot utils
├── tests/
│   ├── smoke/
│   │   └── site-availability.spec.ts
│   ├── navigation/
│   │   └── nav-links.spec.ts
│   ├── forms/
│   │   └── contact-form.spec.ts
│   ├── functional/
│   │   ├── homepage-features.spec.ts
│   │   ├── software-features.spec.ts
│   │   ├── services-overview.spec.ts
│   │   ├── about-page.spec.ts
│   │   └── demo-booking.spec.ts
│   ├── visual/
│   │   └── visual-regression.spec.ts
│   └── responsive/
│       └── layout.spec.ts
├── AGENTS.md                        Agent registry (imported by CLAUDE.md)
├── SKILLS.md                        Skills / slash command reference
├── CLAUDE.md                        Claude Code project instructions
├── global-setup.ts                  Site reachability pre-check
├── playwright.config.ts             Playwright configuration
├── package.json
├── site.config.json                 Target site URL and feature flags
└── tsconfig.json
```

---

## Contributor Rules

### Branching

| Branch pattern | Use for |
|----------------|---------|
| `main` | Protected — only merged via PR |
| `feat/<ticket>-<description>` | New test suites or POM classes |
| `fix/<ticket>-<description>` | Broken selectors or flaky test fixes |
| `chore/<description>` | Config, dependencies, tooling |

### Commit Convention (Conventional Commits)

```
feat(functional): add software page feature tests
fix(forms): update email field selector after redesign
chore: bump Playwright to 1.45
docs: update README setup instructions
```

### Pull Request Checklist

- `npm run typecheck` passes (zero errors)
- `npm run lint` passes
- `npm run test:smoke` passes locally
- All new tests tagged with at least one `@tag`
- Page objects added or updated for any new selectors
- Visual baselines refreshed if layout changed (`npm run baseline`)
- PR description explains what changed and why

### What NOT to Do

- Submit any form — test field interactions only
- Hardcode `https://changesync.com` — always use `baseURL` or `siteConfig.url`
- Put `expect()` calls inside page object methods
- Use `page.waitForTimeout()` without a comment explaining why
- Use `any` type without a justification comment
- Create accounts or enter real credentials

---

## Claude Code Agentic Commands

Claude Code can automate test creation, site analysis, and reporting. Start a Claude Code session in this repo and invoke:

| Command | Description |
|---------|-------------|
| `/analyze-site` | Crawl changesync.com and update `site.config.json` |
| `/generate-full-suite` | Generate complete POM + test suite from site analysis |
| `/run-smoke` | Run smoke tests and print a formatted pass/fail report |
| `/update-baseline` | Refresh visual regression snapshots after a UI change |
| `/generate-report` | Produce a Markdown summary of the last test run |

```bash
# Start Claude Code in this repo
claude

# Then invoke a skill
/run-smoke
/analyze-site
```

See `AGENTS.md` for the sub-agent registry and `SKILLS.md` for the full skills reference.

---

## CI / GitHub Actions

The pipeline in `.github/workflows/playwright.yml` runs on every push and PR:

1. **Smoke** — fast gate; blocks subsequent jobs if the site is unreachable
2. **Functional + Navigation + Forms** — runs in parallel after smoke passes
3. **Responsive** — layout checks across viewports

HTML reports and test results are uploaded as artifacts on failure.

---

## Support

- **Issues:** Open a GitHub Issue using the appropriate template in `.github/ISSUE_TEMPLATE/`
- **Questions:** Contact rosmall@teksystems.com
- **Claude Code docs:** https://code.claude.com/docs
