# 05 — Reference

## Branches
| Branch | Purpose |
|---|---|
| `feature/AIR-16kb-rn-077` | **THE live line.** RN 0.81 upgrade + develop sync + fixes (PR #134). |
| `feature/AIR-540-env-per-environment` | env per build variant (PR #137) |
| `feature/AIR-541-dynamic-app-version` | dynamic version (PR #139) |
| `feature/AIR-544-network-check` | network check (PR #140) |
| `feature/AIR-3.5-combined` | OLD combined branch (PR #141) — stale, rebuild it |
| `local/AIR-544-dev-login-bypass` | dev-only login bypass — never merge |

## Key commits
- `b8002b0` — merge: sync develop into RN 0.81 upgrade + migrate file picker (on #134)
- `6a3f792` — Contact-tab back-button fix (the build QA tested)
- `0df627f`, `eece2ec` — AIR-544 network check

## The nav v7 breaking change (root of the 12 fixes)
Verified in `node_modules/@react-navigation/routers/src/StackRouter.tsx`
(NAVIGATE case): in v7, `navigation.navigate('X')` only pops back to an existing
'X' if you pass `{pop: true}` or call `navigation.popTo('X')`. Otherwise, if 'X'
isn't the *current* focused route, it **pushes a new instance** (duplicate). v6
popped back by default. → Use `popTo` for backward "return to a prior screen"
navigations. Forward navigations are unchanged.

## Library migrations done on #134
| From | To | Why | Where |
|---|---|---|---|
| `react-native-document-picker@9.3.1` | `@react-native-documents/picker@12` | old one deprecated + uses removed `GuardedResultAsyncTask` (won't build on RN 0.81) | AIR-636 receipt flow: `ExpenseFormReceiptUpload.tsx`, `expenseForm/utils.ts` |
| `react-query` (import) | `@tanstack/react-query` | upgrade migrated the data layer | `useSupportedFileFormats.ts` |

## Useful commands
```bash
# adb (not on PATH)
ADB=~/Library/Android/sdk/platform-tools/adb

# CI status
gh pr checks 134

# find all navigate() calls (the v7 risk surface)
git grep -nE "\.navigate\(" -- 'src/**'

# confirm a clean merge into develop (no resurrection)
git merge-tree --write-tree origin/develop HEAD

# version deltas (old develop vs upgrade)
# react 18.3.1→19.1.4 · RN 0.75.5→0.81.6 · react-query v3→@tanstack v5
# nav v6.1.9→v7.2.5 · firebase 20.4→22.4
```

## Docs repo (external context)
`github.com/franciscobeccaria/docs/tree/main/projects/aires`
- `16kb-qa-handoff.md` — what QA tested on #134 (the regression scope)
- `16kb-phase2-0.81-plan.md` — the upgrade plan + forced migrations
- `16kb-rn-upgrade-plan.md`, `16kb-phase1-report.md`, `16kb-summary.md`
- `air-544/` — AIR-544 deliverable

## Audits run this session (multi-agent workflows)
1. **Compatibility audit** of Erika's 28 merged files → 2 HIGH nav findings + 6
   LOW Crashlytics, 2 rejected false alarms.
2. **`navigate()` classification** of all 71 calls → 12 confirmed v7 regressions
   (payment-accounts + login-auth fully verified; tail cut off by token limit but
   the pattern was completed deterministically by direct code inspection).

## Jira
- AIR-544 (network check), AIR-541 (version), AIR-540 (env), AIR-539/534 (16kb/RN)
  — all CR011 / v3.5.0.
- AIR-542 "Offline message" / AIR-543 (JuanMa, To Do stubs) — leave as-is.
