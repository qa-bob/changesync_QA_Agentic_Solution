# Skills

Skills are reusable, on-demand workflows stored as Markdown files in `.claude/commands/`. Invoke them with a `/` prefix in a Claude Code session. Skills only load into context when invoked — unlike `CLAUDE.md`, they do not consume tokens every session.

See the [Claude Code skills docs](https://code.claude.com/docs/en/skills) for the full specification.

---

## Available Skills

### /analyze-site

**File:** `.claude/commands/analyze-site.md`

Crawls the live ChangeSync website and produces an updated `site.config.json`. Use this after a site redesign or when verifying the current config is still accurate.

```
/analyze-site
/analyze-site https://staging.changesync.com
```

**What it does:**
1. Navigates to the site URL (follows redirects)
2. Extracts nav items, forms, page title, meta description, CTA text
3. Checks for HTTPS, viewport meta, and contact form presence
4. Outputs a ready-to-paste `site.config.json` block
5. Reports issues: missing meta tags, broken links, no alt text, etc.

---

### /generate-full-suite

**Registered in:** harness skill registry  
*(Also available as `.claude/commands/generate-full-suite.md` if a local override exists)*

Analyzes the site and generates a complete POM + test suite. This is the zero-to-coverage command — run it on a fresh clone to bootstrap working tests immediately.

```
/generate-full-suite
```

**What it does:**
1. Reads `site.config.json`
2. Discovers pages, forms, and interactive elements via live inspection
3. Creates or updates POM classes in `src/pages/`
4. Generates test files in the appropriate `tests/<category>/` directory
5. Runs `npx tsc --noEmit` to verify the output compiles

---

### /run-smoke

**File:** `.claude/commands/run-smoke.md`

Runs `@smoke` tests and formats the output as a concise pass/fail report. Use this as a quick health check before a deploy or after a site change.

```
/run-smoke
```

**What it does:**
1. Executes `npm run test:smoke`
2. Parses `test-results/results.json`
3. Outputs a Markdown table: test name, status, duration
4. Highlights any failures with the first error line

---

### /update-baseline

**File:** `.claude/commands/update-baseline.md`

Captures fresh visual regression snapshots to replace the current baselines. Run this after intentional UI changes so future runs compare against the new design.

```
/update-baseline
```

**What it does:**
1. Executes `npm run baseline` (`playwright test --grep @visual --update-snapshots`)
2. Reports which snapshot files were created or updated
3. Lists any screenshots that could not be captured (e.g., network errors)

---

### /generate-report

**File:** `.claude/commands/generate-report.md`

Reads the most recent `test-results/results.json` and produces a human-readable Markdown summary of passed, failed, and skipped tests — with actionable next steps for failures.

```
/generate-report
```

**What it does:**
1. Reads `test-results/results.json`
2. Calculates pass rate, total duration, suite breakdown
3. Lists failing tests with error messages and file locations
4. Suggests next steps (selector update, baseline refresh, site-side issue)

---

## Creating a New Skill

1. Create `.claude/commands/<skill-name>.md`
2. Write the skill body (see template below)
3. Add an entry to this file under **Available Skills**
4. The skill is available as `/<skill-name>` immediately — no restart needed

### Skill File Template

```markdown
# /<skill-name>

One-line description of what this skill does.

## Usage

/<skill-name> [optional-arg]

## What this skill does

1. Step one — what Claude does first
2. Step two
3. Step three — what the output looks like

## Output

Description of the artifact or report produced.
```

---

## Skills vs Agents vs Rules

| Mechanism | Location | Loads when | Use for |
|-----------|----------|------------|---------|
| **Skill** | `.claude/commands/*.md` | Invoked with `/command` | Multi-step workflows, on-demand procedures |
| **Agent** | `.claude/agents/*.md` | Spawned by Claude | Scoped sub-tasks with dedicated tool access |
| **Rule** | `.claude/rules/*.md` | Every session (or on path match) | Always-on instructions scoped to file types |
| **CLAUDE.md** | `./CLAUDE.md` | Every session | Project-wide facts, standards, architecture notes |

Skills are preferred over adding procedures to `CLAUDE.md` because they only consume context when needed. A skill that loads 200 lines of instructions is free until you invoke it.
