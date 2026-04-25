# Developer Docs

Personal knowledge base organized as a **developer journey** — from estimating a ticket to shipping it.
Each section maps to a phase of the workflow. Read in order when onboarding; jump to the relevant section when you need a reference.

---

## Developer Journey

### 1. Estimate
> Size the work before starting.

- [WBS & Frontend Estimation](general/estimation/wbs-fe-estimation.md) — breakdown methodology, CRUD labeling, effort mapping

### 2. Plan with AI
> Think before coding. Use AI as a technical pair.

- [Planner Workflow](general/planning/planner-workflow.md) — sequential AI-assisted task resolution, step-by-step
- [Just Prompt](general/planning/just-prompt-workflow.md) — minimal quick-start template for any AI session
- [Enhanced Planner](general/planning/enhanced-planner-workflow.md) — advanced flow with Figma + Jira context *(one screen at a time)*

### 3. Architect
> Define structure before writing logic.

- [Component Architecture](general/architecture/component-architecture.md) — block order inside a React component, naming conventions
- [Component Template](general/architecture/ComponentTemplate.tsx) — copy-paste starter for any new component

### 4. Quality & Commits
> Keep the codebase clean and the history readable.

- [Code Quality Guidelines](general/quality/code-quality-guidelines.md) — pre-commit hooks, GitHub Actions, CI standards
- [Commit Guidelines](general/quality/commit-guidelines.md) — Conventional Commits prompt + rules

### 5. AI Agent
> Automate and extend the workflow with custom agents.

- [Francisquito Docs](agents/francisquito/docs.md) — agent overview and capabilities
- [Francisquito Frontend Dev Rules](agents/francisquito/francisquito-frontend-dev.md) — strict rule set for frontend refactors

---

## Project Notes

> Project-specific docs that follow the same journey. Use as reference when working on that project.

### TD Bank
- [Development Guidelines](projects/td-bank/development-guidelines.md) — component-first principles, research-driven workflow, naming conventions

### Vation
- [Test Automation](projects/vation/automation.md) — Cypress + BDD setup, Page Object Model, custom commands, CI execution
