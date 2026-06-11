---
name: Bug report
about: A test is failing, flaky, or producing incorrect results
title: '[BUG] '
labels: bug
assignees: ''
---

## What is failing?

<!-- Test file and test name -->

**File:** `tests/<category>/<file>.spec.ts`
**Test:** `<describe block> > <test name>`
**Tag:** `@smoke | @navigation | @forms | @functional | @visual | @responsive`

## Expected behavior

<!-- What should the test do? -->

## Actual behavior

<!-- What is it doing instead? Paste the error message. -->

```
<paste error output here>
```

## Steps to reproduce

1. `npm run test:smoke` (or relevant command)
2. See failure in `<test name>`

## Environment

- OS:
- Node version (`node -v`):
- Playwright version (`npx playwright --version`):
- Browser:
- Site URL tested against:

## Additional context

<!-- Screenshots, trace files, or any other relevant info -->
