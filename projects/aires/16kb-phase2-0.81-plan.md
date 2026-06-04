# AIRES — RN 0.77.3 → 0.81.x Execution Plan (Phase 2, folded into one delivery)

> **Status:** ✅ **COMPLETE — RN 0.81.6 reached, both platforms build, 16KB holds 19/19** (2026-06-01). Migration facts grounded via Context7. NOT pushed. Next: hand iOS build to Francisco for manual QA once Firebase access lands.
>
> **Hop progress (all ✅, 6 commits on `feature/AIR-16kb-rn-077`):**
> - ✅ **0.78.3** — React 19.0 + TanStack v5 + i18next 15 + TS 5.6.3. Commits `048d85e`/`79fa064`/`e7f02e6`.
> - ✅ **0.79.7** — Metro 0.82 package-exports OFF (Firebase fix), Gradle 8.13, CLI 18. Commit `8b497ee`.
> - ✅ **0.80.3** — React 19.1.4, Kotlin 2.1.20, Gradle 8.14.1, CLI 19.1.2, compileSdk 36. Forced: screens 4.24.0 (last Old-Arch), reanimated 3.19.5. Commit `f960cb8`.
> - ✅ **0.81.6** — nav v6→v7, Firebase 20→22 (native SDK 11.15.0), +gesture-handler 2.31.2, svg→15.15.5, targetSdk 36, edgeToEdgeEnabled=false, Gradle 8.14.3. Commit `26035af`.
>
> **Final 16KB audit (RN 0.81.6):** zipalign -P 16 pass · arm64-v8a+x86_64 only · 19/19 .so aligned ≥16KB · 0 misaligned.
> **Residual type-debt:** ~14–25 tsc errors (non-blocking; Metro/babel don't typecheck; baseline was 93). 2 latent bugs worth Francisco's review: `copyrightData.COPYRIGHT` casing, `paymentAccount.accountDescription` model mismatch.
> **Local only** (not committed, not pushed), like the other docs.
> **Branch:** continue on `feature/AIR-16kb-rn-077` (already at RN 0.77.3, 16 KB-verified).
> **Decision (2026-06-01 meeting):** go all the way to **RN 0.81** so QA runs **once**, not twice. First QA = manual, by Francisco, on the **iOS build** on a physical iPhone. Firebase access is the current blocker for *running* — but **all code changes proceed now**; manual QA happens once access lands.

---

## 1. Goal & guardrails

- **Target:** RN **0.81.x** (latest patch), the **last** release where Old Architecture works (`newArchEnabled=false`). 0.82 ignores the flag.
- **Keep:** Old Architecture, Hermes, Objective-C++ `AppDelegate.mm`.
- **Keep:** 16 KB compliance already achieved at 0.77.3 — re-verify it still holds at 0.81.
- **React 18 → 19** happens at RN 0.78 (unavoidable on this path) — this is the main new risk vs Phase 1.
- **Gate every hop by building both platforms + the 16 KB ELF audit.** Version is the means; build+audit is the gate.

---

## 2. Starting point (verified today)

| Item | Now (0.77.3) | Target (0.81.x) |
|---|---|---|
| react-native | 0.77.3 | **0.81.x** |
| react | 18.3.1 | **19.x** (lands at 0.78) |
| compileSdk / targetSdk | 35 / 35 | **36 / 36** |
| Kotlin | 2.0.21 | **2.1.20** |
| Gradle | 8.10.2 | **8.14.1** |
| NDK | r28 (28.2.13676358) | r28 (keep) |
| newArchEnabled | false | false (keep) |

---

## 3. The forced dependency migrations (the real work)

These are dictated by crossing React 18→19 (at 0.78) and the Fabric/codegen ABI changes through 0.81. Exact target versions confirmed at each hop by building.

| Dependency | Now | Target for 0.81 | Why |
|---|---|---|---|
| **react** | 18.3.1 | **19.x** | Ships with RN 0.78 |
| **@react-navigation/** * | v6 | **v7** | Last Old-Arch-compatible major; API renames (e.g. `headerBackTitleVisible` → `headerBackButtonDisplayMode`) |
| **@react-native-firebase/** * | 20.4.0 | **22.x** | Modular API; v22 is the Old-Arch-safe line for 0.81 |
| **react-query** | 3.39.3 | **@tanstack/react-query v5** | v3 is incompatible with React 19 (no `useSyncExternalStore`). **Biggest migration — data layer.** |
| **react-i18next** | 13.5.0 | **14/15** | React 19 compatibility |
| **react-native-reanimated** | ~3.16.7 | **3.19.x** (re-derive) | 0.77 needed 3.16; 0.81 needs newer. NOT 4.x (requires New Arch) |
| **react-native-svg** | 15.12.1 | **re-derive** (likely 15.13+) | The 0.77 pin reason (old Yoga) is gone at 0.81; let it move up |
| **react-native-screens** | ^3.27 (→3.37) | **^4.x** (last Old-Arch line, re-derive) | 4.x needed for newer RN; avoid the New-Arch-only releases |
| **react-native-gesture-handler** | not installed | **ADD ~2.x** | Explicit peer dep for nav v7 / screens 4 / reanimated |
| react-native-safe-area-context | 5.4.0 | likely OK / minor bump | Verify at build |
| react-native-webview, pdf, etc. | current | verify, bump only if broken | Same "bump only what breaks" rule |

> ⚠️ The 0.77 pins (svg 15.12.1, reanimated 3.16.7) were specific to RN 0.77's ABI. **They will change for 0.81** — do not assume they carry over.

---

## 4. Metro / build config changes

- **RN 0.79+:** Metro turns on package `exports` resolution by default → known **Firebase** breakage. Fix: `resolver.unstable_enablePackageExports = false` in `metro.config.js` (one line).
- **RN 0.81:** `compileSdk/targetSdk 36`, Node 20.19.4+ (have 20.19.5 ✓), Xcode 16.1+ (have 16.2 ✓).
- **Edge-to-edge (Android 16 / SDK 36):** already enforced today via targetSdk 35; SDK 36 tightens it. Migrate remaining `SafeAreaView` usages toward `useSafeAreaInsets` if visual regressions appear (11 files use SafeAreaView, 6 already use the hook).

---

## 5. Hop sequence (incremental, checkpoint each)

```
0.77.3  ── current, 16 KB-verified ──┐
  │                                  │ each hop:
  ▼                                  │  1. Upgrade Helper diff
0.78  · React 18→19 · react-query→TanStack v5 · i18next   │  2. yarn install
  ▼                                  │  3. fix breaks (build both)
0.79  · Metro exports off (Firebase) · JSC extracted (no-op, we use Hermes)  │  4. pod install
  ▼                                  │  5. Android build + 16 KB ELF audit
0.80  · deep-import deprecations · reanimated stays 3.x   │  6. iOS build
  ▼                                  │  7. commit checkpoint
0.81  · compileSdk 36 · React Navigation v7 · Firebase v22 · gesture-handler
  ▼
RE-VERIFY 16 KB (zipalign + ELF 19+/19) ──► hand iOS build to Francisco for manual QA
```

**Concentrate risk at the 0.78 hop** — that's where React 19 + react-query + i18next all land. If anything bisects badly, 0.78 is the suspect.

---

## 6. QA strategy (per the meeting decision)

- **One round of QA only**, at the end (0.81), not per-phase.
- **First pass = manual, by Francisco, on iOS**, on a physical iPhone.
- **Blocker:** Firebase access (needed to actually run/login). **Does not block code work** — we apply everything now; QA executes when access lands.
- iOS device build needs: a development signing identity/provisioning (Mario can help if it blocks), `GoogleService-Info.plist` (have it), and Firebase backend access (pending).

---

## 7. Risks specific to this path (vs Phase 1)

| Risk | Mitigation |
|---|---|
| React 19 breakage in app JS | Phase 1 audit showed near-zero surface (1 file uses propTypes, 0 class comps, 0 deep RN imports). Still: build + smoke. |
| react-query v3 → TanStack v5 is a real API migration | Biggest single task; isolate it at the 0.78 hop; test data flows in QA. |
| Nav v6 → v7 API renames | Mechanical; do at 0.81 hop; check all navigators/screens. |
| Firebase v20 → v22 modular API | Keep namespaced calls working; migrate imports as needed; v22 is Old-Arch-safe. |
| 16 KB regression from new lib versions | Re-run full ELF + zipalign audit at 0.81 (must stay 19+/19). |
| iOS Fabric ABI mismatch (as in Phase 1) | Same method: derive each lib version by building, not by changelog. |

---

## 8. Definition of done (this delivery)

1. `react-native` = 0.81.x; `newArchEnabled=false` still honored; Hermes on.
2. Android: `assembleStagingRelease` builds; `zipalign -P 16` passes; **every `.so` ≥16 KB aligned**; 64-bit ABIs only.
3. iOS: `Development` scheme builds; app runs on simulator; **device build** ready for Francisco's manual QA.
4. All forced dep migrations applied (nav v7, Firebase v22, TanStack v5, i18next, gesture-handler added).
5. Manual QA (Francisco, iOS device) passes once Firebase access is granted.

---

## 9. What I will NOT do without further go-ahead

- Push the branch or open a PR (local only until you say so).
- Commit the docs (local only).
- Enable the New Architecture.
- Bump any lib to a New-Arch-only major (reanimated 4.x, screens 4.25+, nav v8, Firebase v24).
