# 01 — Session Story: original goal vs. where it ended

## Where we started
The session opened on **AIR-544** (global "No internet connection" network check),
on branch `feature/AIR-544-network-check`. The immediate goal was to verify the
logged-in behavior locally and hand it off.

## How it expanded (in order)

1. **AIR-544 finished & QA'd.** Built a `__DEV__`-only login bypass to reach
   logged-in screens without staging creds, verified the offline overlay (incl.
   the real "Wi-Fi connected but no internet" case), confirmed with Mario (Mayo)
   that tabs-visible is the desired design. PR #140 opened. Dev bypass preserved
   on a local branch, never committed to the feature branch.

2. **Decided the 3.5 packaging strategy.** Reviewed Slack (Mario + Erika +
   `#aires-internal`), GitHub PRs, Jira, engram. Plan: keep per-ticket PRs
   (#134/137/139/140) open for QA traceability, then one combined branch/PR for
   release 3.5 that also carries upcoming polish work.

3. **Built the combined branch — and it surfaced a real problem.** Cherry-picking
   AIR-540/541/544 onto the RN 0.81 upgrade branch worked, but **CI failed**:
   `react-native-document-picker@9.3.1` won't compile on RN 0.81 (uses the removed
   `GuardedResultAsyncTask`).

4. **Root cause was bigger than one library.** The RN upgrade branch
   (`feature/AIR-16kb-rn-077`) had been cut ~10 days earlier and was **stale vs.
   `develop`**. Since then Erika merged 5 PRs (AIR-499, AIR-508, AIR-534, AIR-636,
   password-crash). When the upgrade branch merges with current `develop`, git
   **silently resurrects** removed dependencies and combines overlapping code —
   the document-picker error was just the loudest symptom.

5. **Fixed the upgrade ⨉ develop reconciliation (on PR #134).**
   - Merged current `develop` into the upgrade branch.
   - Migrated `react-native-document-picker` → `@react-native-documents/picker@12`
     (the maintained successor; supports RN ≥0.79) in the AIR-636 receipt flow.
   - Migrated a stray `react-query` import → `@tanstack/react-query` in
     `useSupportedFileFormats`.
   - **CI went green.** Committed as `b8002b0`.

6. **Audited the rest of the upgrade (you asked: "be critical, it's a big
   upgrade").** Ran two multi-agent audits:
   - Compatibility audit of Erika's 28 merged files vs RN 0.81 / React 19 /
     react-query v5 / nav v7 / Firebase v22.
   - A focused classification of all 71 `navigate()` calls for the
     react-navigation **v6→v7 breaking change** (`navigate` no longer pops back
     to an existing screen — it pushes a duplicate unless you use `popTo`).

## Where it ended
- The audits confirmed **12 real `navigate()` v7 regressions** (verified against
  the actual v7 `StackRouter` source, not assumed) plus low-severity Crashlytics
  deprecation noise.
- Cross-referenced with the docs repo: **QA already ran a full regression on
  #134** and didn't report these — because they're post-action "return to list"
  navigations where the duplicate visually resembles the destination.
- We hit a model token limit before applying the fixes. **The fix list is
  complete and verified; applying it is the next action.**

## The meta-lesson
"Compiles + per-PR-tested" hid real regressions. A large upgrade reconciled
against a moved-on `develop` needs explicit reconciliation + behavior audit, not
just a merge. The combined-branch approach is what surfaced all of this — which
is exactly its value.
