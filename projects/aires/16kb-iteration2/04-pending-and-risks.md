# 04 — Pending Items, Risks & Ownership

## Pending (must do before 3.5 ships)
| # | Item | Owner | Blocking? |
|---|---|---|---|
| 1 | Apply the 12 `navigate()` → `popTo()` fixes on #134 | Francisco | yes |
| 2 | Crashlytics warning silencer (1 line) | Francisco | no (cosmetic) |
| 3 | Erika reviews the receipt-picker migration | Erika | yes (her feature) |
| 4 | Targeted re-QA of changed flows, both platforms | Juanjo (QA) | yes |
| 5 | Rebuild combined 3.5 branch (#141) on fixed #134 | Francisco | yes |
| 6 | Close per-ticket PRs (#137/139/140) once combined is validated | Francisco | no |

## Decisions still owed (from the user)
- **Where the combined 3.5 PR targets** — `develop` (current assumption; develop
  is the 3.5 accumulation line) vs. a dedicated `release/3.5` branch. Affects how
  3.5 is cut. (Raised with Mario; he said "adelante el merge con develop".)
- **The "polish" work** Mario is doing this week — folds into the combined branch
  next week (per the Mario chat). Not started.

## Risks
1. **Receipt-picker migration is untested at runtime.** Migrated
   `react-native-document-picker@9.3.1` → `@react-native-documents/picker@12`
   (new `pick()`/`keepLocalCopy()` API, `errorCodes` cancel handling,
   `localUri`-based base64). Compiles + typechecks, but file-picking can't be
   verified without a device. **Needs Erika review + device QA.** This is the
   single riskiest change.
2. **The nav v7 change is app-wide in principle.** We verified 12 real
   regressions and excluded the rest, but any *future* `navigate()` to an
   already-mounted screen has the same trap. Worth a lint rule / team note.
3. **Stale-merge resurrection can recur.** Any branch cut before the upgrade that
   later merges develop can re-introduce removed deps (how the document-picker
   bug appeared). #134 now contains develop, so it's safe — but other long-lived
   branches aren't.
4. **PR #141 is misleading as-is.** It's the OLD combined branch and will fail CI
   the same way. Either rebuild it (Step 5) or mark it clearly so nobody merges
   it.
5. **iOS not re-verified** after the document-picker migration. The new picker is
   a native module; iOS needs `pod install` (Ruby 3.1.2) + a device pass.

## Known-but-acceptable (do NOT treat as bugs)
- Crashlytics namespaced-API deprecation `console.warn`s (crash reporting works).
- The `tsc` baseline of ~94–98 pre-existing errors on the upgrade branch
  (unrelated to this work; present before).
- SafeAreaView / "Legacy Architecture" deprecation warnings (intentional — Old
  Arch is kept).

## Team / context pointers
- **Mario (Mayo)** — Mobile Area Director; feature requests, release status,
  client-facing.
- **JuanMa** — release coordination, store submission, Aires QA liaison; owns
  AIR-542/543 (stubs).
- **Juanjo (Juan Jose)** — QA; runs regression on Firebase builds.
- **Erika** — most-active dev; owns the develop work merged in (AIR-499/508/534/
  636); reviewer.
- Internal channel: `#aires-internal` (Slack, `C066GJDA6GP`).
- Test-credential issues are a recurring team blocker (tracked by JuanMa with
  Aires) — this is why AIR-544 logged-in QA used a dev bypass locally.
