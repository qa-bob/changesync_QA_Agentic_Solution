# Agents

This file is the agent registry for this repository. It is imported by `CLAUDE.md` via `@AGENTS.md` so Claude Code reads it at the start of every session.

Sub-agents are specialized Claude Code instances that handle scoped workloads without consuming the main context window. They can run in parallel via the Workflow harness.

---

## Registered Agents

### site-analyzer

| Field | Value |
|-------|-------|
| **File** | `.claude/agents/site-analyzer.md` |
| **Invoked by** | `/analyze-site` |
| **Purpose** | Crawl a live website and produce a fully-populated `site.config.json` |

**When to use:**
- Onboarding the framework to a new site or URL
- Verifying an existing `site.config.json` is still accurate after a redesign
- Discovering new pages, forms, or nav items added to the site

**Inputs:**

| Input | Required | Description |
|-------|----------|-------------|
| `url` | Yes | The site to crawl |
| `companyName` | No | Override the inferred company name |

**Outputs:**
- Updated `site.config.json` with all fields populated
- Issues checklist (missing meta tags, broken nav links, missing alt text, etc.)
- Confidence rating (High / Medium / Low) with reasoning

---

### test-generator

| Field | Value |
|-------|-------|
| **File** | `.claude/agents/test-generator.md` |
| **Invoked by** | `/generate-full-suite` |
| **Purpose** | Generate site-specific Playwright test files from `site.config.json` |

**When to use:**
- After `/analyze-site` to turn the config into working test code
- When a site has unique functionality not covered by the generic suite
- Writing regression tests for a recently discovered bug

**Inputs:**

| Input | Required | Description |
|-------|----------|-------------|
| `siteConfig` | Yes | The current `site.config.json` |
| `testScenarios` | No | Descriptions of specific scenarios to cover |
| `pagesToTest` | No | List of page paths (e.g., `/software`, `/about`) |

**Outputs:**
- TypeScript test files in `tests/custom/<scenario>.spec.ts`
- Updated or new page objects in `src/pages/` if new selectors are needed

---

## How Sub-agents Work in Claude Code

When Claude Code spawns a sub-agent it:

1. Loads only the tools the agent needs (scoped context — smaller, faster)
2. Runs the instructions defined in the agent's `.md` file
3. Returns structured output to the main session

Agents can run in parallel via the Workflow harness, for example:

```
/analyze-site        → feeds results into →
/generate-full-suite → feeds results into →
/run-smoke           → feeds results into →
/generate-report
```

See the [Claude Code sub-agents docs](https://code.claude.com/docs/en/sub-agents) for the full specification.

---

## Adding a New Agent

1. Create `.claude/agents/<agent-name>.md` with:
   - `## Role` — what this agent does
   - `## When to invoke` — trigger conditions
   - `## Capabilities` — tools it uses
   - `## Inputs` / `## Output` — I/O contract
   - `## Step-by-step instructions` — execution procedure
2. Add an entry to this file under **Registered Agents**
3. Optionally create `.claude/commands/<agent-name>.md` for a corresponding `/slash-command`
4. The agent is available immediately — no registration step needed

---

## Agent Conventions

All agents in this repo follow these rules:

- Never submit forms or create accounts
- Use `WebFetch` to inspect live pages before writing selectors
- All generated TypeScript must pass `npx tsc --noEmit`
- Tag every generated test with at least one `@smoke | @navigation | @forms | @functional | @visual | @responsive`
- Never hardcode `https://changesync.com` — read the URL from `site.config.json`
- Operate on `site.config.json` as the single source of truth for site metadata
