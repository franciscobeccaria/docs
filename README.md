# Francisco AI Workflow — Docs

Personal knowledge base organized around the **feature lifecycle** — from spec to learnings.
Each section maps to a step in the workflow. Read in order when onboarding; jump to the relevant step when you need a reference.

---

## Feature Lifecycle

### 1. Feature Spec
> Define what to build before touching code.

- [Feature Spec Template](general/spec/feature-spec-template.md) — parent doc, links sub-specs, tracks status
- [Product Spec Template](general/spec/product-spec-template.md) — user stories, acceptance criteria, edge cases
- [QA Spec Template](general/spec/qa-spec-template.md) — manual scenarios, automated coverage, browsers
- [Design Spec Template](general/spec/design-spec-template.md) — Figma links, components, states, responsive notes

### 2. Plan
> Think before coding. Use AI as a technical pair.

- [WBS & Estimation](general/planning/wbs-fe-estimation.md) — breakdown methodology, CRUD labeling, effort mapping
- [Planner Workflow](general/planning/planner-workflow.md) — sequential AI-assisted task resolution
- [Just Prompt](general/planning/just-prompt-workflow.md) — minimal quick-start template for any AI session
- [Enhanced Planner](general/planning/enhanced-planner-workflow.md) — advanced flow with Figma + Jira context *(one screen at a time)*

### 3. Architect
> Define structure before writing logic.

- [Component Architecture](general/architecture/component-architecture.md) — block order inside a React component, naming conventions
- [Component Template](general/architecture/ComponentTemplate.tsx) — copy-paste starter for any new component

### 4. Implement
> Write the code.

*Execution step — no doc needed. Follow the plan.md generated in step 2.*

### 5. QA Manual (pre-review)
> Verify in the browser before running automated tools.

*Use the [QA Spec](general/spec/qa-spec-template.md) scenarios as your checklist.*

### 6. Review & Simplify
> `/review`, `/simplify`, accessibility, performance.

- [Code Quality Guidelines](general/quality/code-quality-guidelines.md) — pre-commit hooks, GitHub Actions, CI standards

### 7. Test
> Automated tests across environments.

- [Testing Strategy](general/testing/testing-strategy.md) — layers (unit, E2E, a11y, perf), tooling, per-feature checklist, report artifacts

### 8. Commits & PRs
> Ship clean history.

- [Commit Guidelines](general/quality/commit-guidelines.md) — Conventional Commits prompt + rules

### 9. Reviews
> Copilot, human, QA — resolve all comments before merge.

*Use the [QA Spec](general/spec/qa-spec-template.md) as the QA reviewer's input.*

### 10. Merge & Observe
> Ship, then watch.

*Observability setup (Sentry, etc.) is project-specific — see Project Notes below.*

### 11. Learnings
> After every feature, one honest pass.

- [Learnings Template](general/learnings/learnings-template.md) — what worked, what slowed you down, patterns to reuse, follow-up debt

---

## AI Agents

> Reusable agents and their operating rules.

- [Francisquito Docs](agents/francisquito/docs.md) — agent overview and capabilities
- [Francisquito Frontend Dev Rules](agents/francisquito/francisquito-frontend-dev.md) — strict rule set for frontend refactors

---

## Reusable Skills

> Claude Code skills authored for this workflow. Each folder is a self-contained `SKILL.md` (plus references) that can be dropped into `~/.claude/skills/`.

- [Idea to Feature](skills/idea-to-feature/SKILL.md) — turn a raw idea into a lean ticket: capture → iterate UI in a chosen lane → write ACs that follow the idea *only*, no padding. Feeds step 1 (Feature Spec).
- [Weekly Checkin](skills/weekly-checkin/SKILL.md) — reconstruct what you worked on each day for the Koombea timesheet by cross-referencing git commits, GitHub PRs, and Jira ticket history. See [project map](skills/weekly-checkin/references/projects.md).

---

## Project Notes

> Project-specific docs. Follow the same workflow but scoped to a single project.

### Mina Baie
- [Documentation Index](projects/mina-baie/00-index.md) — index + quick reference for all 7 docs
- [01 — Project Context](projects/mina-baie/01-project-context.md) — architecture, services, client contacts
- [02 — Implementation Log](projects/mina-baie/02-implementation-log.md) — all PRs, technical decisions
- [03 — Known Issues & Fixes](projects/mina-baie/03-known-issues-and-fixes.md) — bugs, root causes, fixes
- [04 — Workflow](projects/mina-baie/04-workflow.md) — branch naming, commit conventions, deploy & sync
- [05 — Auto Featured Product](projects/mina-baie/05-auto-featured-product.md) — feature analysis, estimate, work plan
- [06 — PR #18 Final Status](projects/mina-baie/06-pr-18-final-status.md) — Klaviyo visibility fix, 4 QA iterations
- [07 — Project Status Snapshot](projects/mina-baie/07-project-status-snapshot.md) — global status as of 2026-04-21

### TD Bank
- [Development Guidelines](projects/td-bank/development-guidelines.md) — component-first principles, research-driven workflow, naming conventions

### Vation
- [Test Automation](projects/vation/automation.md) — Cypress + BDD setup, Page Object Model, custom commands, CI execution
