# 02 — Current Status (as of end of session 2026-06-12)

## Branches & PRs

| PR | Branch | Base | State | Notes |
|---|---|---|---|---|
| **#134** | `feature/AIR-16kb-rn-077` | develop | **CI GREEN**, tip `b8002b0` | RN 0.81 upgrade **+ develop sync + library fixes**. This is the live line of work. |
| #137 | `feature/AIR-540-env-per-environment` | develop | open | env-per-variant. 1 commit. |
| #139 | `feature/AIR-541-dynamic-app-version` | develop | open | dynamic version on About Us. 1 commit. |
| #140 | `feature/AIR-544-network-check` | develop | open | network check. 2 commits. QA'd locally. |
| **#141** | `feature/AIR-3.5-combined` | develop | open but **STALE/SUPERSEDED** | Built on the OLD combined branch before the upgrade was fixed. Do NOT use as-is — must be rebuilt (see 03). |

## Local-only branches (not pushed, intentional)
- `local/AIR-544-dev-login-bypass` — the `__DEV__` login bypass used to QA AIR-544
  logged-in screens. **Never merge.** Recover with `git switch`.
- `backup/16kb-with-docs`, `docs/AIR-16kb-rn-upgrade-plan` — older working branches.

## What's committed & verified ✅
- **PR #134 = the upgrade, reconciled with develop:**
  - RN 0.75.5 → 0.81.6, React 18 → 19, react-query v3 → @tanstack v5 (53 hooks),
    nav v6 → v7, Firebase v20 → v22, +gesture-handler. (Original upgrade work.)
  - **Develop synced in** (Erika's AIR-499/508/534/636 + password-crash).
  - **document-picker → `@react-native-documents/picker@12`** migration (AIR-636
    receipt flow). Compiles on RN 0.81.
  - **react-query import fix** in `useSupportedFileFormats`.
  - `tsc`: no new errors vs upgrade baseline. Lint clean. **Android CI green.**
- **AIR-544** feature complete + locally QA'd (offline overlay, Wi-Fi-no-internet,
  Try Again recovery, tabs-visible confirmed by Mario).

## What's identified but NOT yet done ⚠️
- **12 react-navigation v7 `navigate()` regressions** — verified, fix list ready
  (see 03 / 05), **not yet applied**. These are "return to a previous screen"
  navigations that v7 turns into duplicate-screen pushes.
- **Crashlytics deprecation warnings** (Firebase v22) — low; not yet silenced.
- **Receipt-picker migration needs Erika's review + device QA** (her AIR-636
  feature, migrated to a new library, can't be runtime-verified locally).
- **Combined 3.5 branch (#141) needs rebuilding** on the fixed #134.

## QA context (important)
Per the docs repo (`16kb-qa-handoff.md`), **QA (Juanjo) already ran a full
both-platform regression on #134** Firebase builds (commit `6a3f792`), with nav
v7 / login / payments as ⭐ focus. The internal review caught + fixed one nav
issue (Contact tab back-button). The 12 `navigate()` regressions were NOT
reported then — they're subtle post-action returns. A **targeted** re-QA of just
the fixed flows is enough (not a full re-pass).

## Release framing
- These are all **CR011 / v3.5.0** (Francisco's release; ships last, after 3.3.1
  and 3.4 which are Erika's / in-store-review).
- `develop` is the 3.5 accumulation line. The "combined 3.5 PR" is effectively a
  release PR once everything lands.
