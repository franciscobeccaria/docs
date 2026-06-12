# AIR — 16KB Upgrade, Iteration 2 (2026-06-12)

> **Why this folder exists (second iteration).** The original `16kb-*` docs in
> the parent folder cover the upgrade up through PR #134 going green. *After*
> that, Erika merged ~10 days of `develop` (AIR-499/508/534/636 + password-crash)
> on top of the upgrade base, which forced a reconciliation pass and surfaced a
> class of React Navigation **v7** regressions. This folder is the record of that
> second pass — reconciling the upgrade with the moved-on `develop`, then finding
> and fixing the nav v7 regressions.

This folder documents a long working session that started narrow (finish AIR-544)
and expanded into reconciling the **React Native 0.81 upgrade** with everything
the team merged into `develop` since. Read in order:

| Doc | What it covers |
|---|---|
| [01-session-story.md](01-session-story.md) | How we got here — the original goal vs. where it ended |
| [02-current-status.md](02-current-status.md) | Exact state of every branch, PR, and CI right now |
| [03-next-steps.md](03-next-steps.md) | The ordered plan to finish, with the verified fix list |
| [04-pending-and-risks.md](04-pending-and-risks.md) | Open items, decisions owed, risks, and who-owns-what |
| [05-reference.md](05-reference.md) | Branches, commands, the navigate() fix list, doc links |

**One-line status:** the RN 0.81 upgrade branch (PR #134) is green on CI with the
post-merge library fixes in; the **12 react-navigation v7 `navigate()`
regressions are now fixed and pushed** (`popTo`), Firebase v22 deprecation
warnings silenced — next is targeted re-QA, then rebuilding the combined 3.5
branch on top.

## Update — fixes applied & pushed (2026-06-12, later same day)

The fixes that the original handoff left "identified but not applied" are now
**done and on the branch**:

- ✅ **All 12 nav v7 fixes applied** — `navigate()` → `popTo()` at the verified
  backward-navigation sites (9 payment-account, 3 expense-form, 3 login incl. the
  `useAppNavigation` helper via `StackActions.popTo`). The two "do NOT change"
  exclusions were left as `navigate()`.
- ✅ **Firebase v22 deprecation warnings silenced** —
  `globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true` set as the first
  side-effect in `index.js` (new `src/config/firebase-silence.ts`). Crash
  reporting still works; full modular-API migration remains a separate follow-up.
- ✅ **Verified:** `tsc` 92 errors (was 94 baseline; 0 new, 2 removed),
  `eslint` 0 errors on changed files, Metro production bundle builds clean, jest
  has no suite (exits 0).
- ✅ **Committed `5623232` and pushed** to `feature/AIR-16kb-rn-077` (PR #134).
- ⏳ **Next:** confirm CI green → targeted re-QA of the changed flows (login
  failure/reset return, payment-account create/edit/delete returns, expense
  submit return) → rebuild combined 3.5 branch (#141).

> The sections below (02 / 03) describe the state *before* this update; they are
> kept as the original handoff record. This README's "Update" block is the
> current truth.
