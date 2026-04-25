# Testing Strategy

## Layers

| Layer | Tool | When to write | What it covers |
|---|---|---|---|
| Unit | Vitest / Jest | During implementation | Pure functions, utils, hooks |
| Component | Testing Library | During implementation | Component behavior, states |
| E2E | Cypress / Playwright | After implementation | Critical user flows end-to-end |
| Accessibility | axe / Lighthouse | Before PR | WCAG AA compliance |
| Performance | Lighthouse / Web Vitals | Before PR | LCP, CLS, FID targets |

## Per-feature checklist

- [ ] Happy path covered by E2E
- [ ] Error states covered by unit/component tests
- [ ] Accessibility score ≥ 90 (Lighthouse)
- [ ] No regressions in existing E2E suite

## Running tests

```bash
# Unit + component
npm test

# E2E (local)
npm run cypress:open

# E2E (CI headless)
npm run cypress:run

# Lighthouse
npm run lighthouse
```

## Test environments

| Environment | Purpose | Notes |
|---|---|---|
| Local | Development feedback | Run before every commit |
| Preview URL | Pre-merge validation | Run on every PR |
| Production | Post-merge smoke test | Run after merge/deploy |

## Report artifacts

Store in `docs/specs/[feature]/results.md`:
- Screenshots of failures
- Lighthouse HTML report
- Cypress videos (CI failures only)
