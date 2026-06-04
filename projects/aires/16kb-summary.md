# AIRES — 16 KB Upgrade · Full Summary (Index & Story)

> **Purpose:** Single entry point that tells the whole story — the problem, the competing analyses, how we found the real issue, what we decided, what we built, and what's next. Read this first; it links to the detailed docs.
> **Date:** 2026-06-01
> **Branch:** `feature/AIR-16kb-rn-077` (based on `develop`) — 8 commits, **not pushed**.

---

## 0. Document map

| Doc | What it is | Read when |
|---|---|---|
| **`16kb-summary.md`** (this file) | The story + index | Start here |
| [`16kb-rn-upgrade-plan.md`](./16kb-rn-upgrade-plan.md) | The plan — strategy, version decisions, Phase 1 & 2 | For the *why* |
| [`16kb-phase1-report.md`](./16kb-phase1-report.md) | Phase 1 record — exact changes, verification, next steps | For the *what was done* |

---

## 1. The problem (CR011)

Google Play requires apps targeting Android 15+ to support **16 KB memory page sizes** (native `.so` files aligned to 16 KB, not 4 KB) — or the app can't be updated and risks crashes on newer devices. AIRES is a React Native app on **RN 0.75.5**, whose bundled native libraries (Hermes, React Native core, third-party libs) were 4 KB-aligned. There's no Gradle flag or local patch that fixes this — **only upgrading the RN runtime + NDK toolchain does.**

Deadline was extended to **Feb 2027**, so the goal was: do it correctly and conservatively, smallest change that meets the requirement.

**Hard constraint:** keep the **Old Architecture** (`newArchEnabled=false`) — do NOT adopt React Native's New Architecture (high regression risk, out of scope).

---

## 2. The competing analyses (what we audited)

We had **three external analyses** plus our own audit. They disagreed on the single most important variable — the target RN version.

| Source | Target | Execution | Verdict after audit |
|---|---|---|---|
| **Mario/Mayo** (original plan) | **0.81.6** | 6 phases (or 3 grouped) | Solid engineering, but **over-scoped** — 0.81 is modernization, not the requirement. Also misidentified the 16 KB floor as 0.79. |
| **Gemini** (deep research) | **0.77.3** | incremental | **Right target**, but overstated 0.78+ risk and misattributed edge-to-edge to the RN version. |
| **ChatGPT** (deep research) | **0.77.3** | incremental | Highest-quality external analysis; correct and well-sourced. Added the AAB/`bundletool` check and the "bridge strategy" framing. |
| **Our audit** | **0.77.3** | incremental, 3 grouped, audit-gated | Verified every load-bearing claim against official RN/Android sources. |

**Convergence:** the three analyses that did *fresh* research all landed on **RN 0.77.3** — not Mario's 0.81.

---

## 3. How we found the *real* version answer

We verified the contested claims against primary sources:

- **RN 0.77 blog (official), verbatim:** *"React Native is ready to fully support 16 KB page size."* → 0.77 is the official floor.
- **React 19 ships in RN 0.78, not 0.77** → stopping at 0.77 keeps React 18 and avoids a large JS migration.
- **RN 0.82 ignores `newArchEnabled=false`** → 0.81 is the last Old-Arch-capable release (relevant only to Phase 2).
- **Google's own docs:** 16 KB-by-default needs **AGP 8.5.1+ and NDK r28+**; the requirement is gated on **targetSdk 35** (which AIRES already had).

**Decision:** Phase 1 → **RN 0.77.3** (mandatory, compliance). Phase 2 → **RN 0.81.x** (optional modernization, separate go/no-go).

The decisive principle, repeated throughout: **the version number is the means; the `.so` alignment audit is the actual gate.**

---

## 4. How we found the *real* issue (during execution)

This is the part no analysis predicted, because none audited the actual dependency graph by **building** it.

When we built the RN 0.77.3 Android release and ran the ELF alignment audit:
- First pass: **18/19 `.so` aligned.** The one failure — `libpdfiumandroid.so` (4 KB) from `react-native-pdf@6.x` via `io.legere:pdfiumandroid:1.0.24`. Bumping pdf to 7.0.4 (aligned `pdfiumandroid:1.0.32`) → **19/19 aligned.**

Then the cross-platform reality surfaced: **four third-party native libraries each needed a version matched to RN 0.77's exact C++/Yoga/codegen ABI — and Android and iOS pulled in opposite directions:**

| Library | Android needs | iOS Fabric needs | Resolution |
|---|---|---|---|
| react-native-pdf | ≥7 (alignment) | — | **^7.0.1** |
| react-native-svg | ≥15 (`BaseViewManagerInterface`) | <15.13 (Yoga `StyleLength`, not `StyleSizeLength`) | **15.12.1 (pinned)** |
| react-native-reanimated | — | 3.16.x (3.19 uses RN 0.78+ `parentTag`) | **~3.16.7** |
| react-native-share | — | ≥12 (codegen spec header) | **^12.3.1** |

**Lesson:** the cost of an RN minor bump is not RN core — it's per-library ABI matching, discoverable only by building both platforms. This validated making *build + audit* the gate.

---

## 5. What we did (Phase 1 — complete & verified locally)

**RN 0.75.5 → 0.77.3, Old Arch kept, Hermes kept, Obj-C++ `AppDelegate.mm` kept.**

8 commits on `feature/AIR-16kb-rn-077`:
- RN 0.75.5 → 0.76.9 (SoLoader merged mapping, Gradle 8.10.2, iOS 15.1, removed junk deps)
- RN 0.76.9 → 0.77.3 (NDK r28, Kotlin 2.0.21, `RCTAppDependencyProvider` wiring)
- react-native-pdf → 7.0.4 (16 KB fix)
- drop 32-bit ABIs (arm64-v8a, x86_64 only)
- react-native-svg → 15.x then pinned 15.12.1
- iOS Fabric ABI alignment (reanimated 3.16.7, share 12.3.1, svg pin, Ruby 3.3.5)
- 3 docs (plan, report, this summary)

**Verified:**
- **Android:** 19/19 `.so` 16 KB-aligned · `zipalign -P 16` successful · 64-bit ABIs only · `getconf PAGE_SIZE` = 16384 on emulator · app loads native libs, no crash.
- **iOS:** `Development` scheme BUILD SUCCEEDED · app launches on simulator, no crash.

Full detail and re-run commands: [`16kb-phase1-report.md`](./16kb-phase1-report.md).

---

## 6. Session timeline (how we got here)

1. **Audit** — reviewed Mario's plan + the meeting notes; verified RN/Android facts; concluded incremental-to-0.77 (not single-jump, not 0.81).
2. **Cross-check** — reconciled Gemini and ChatGPT deep-research drafts; all converged on 0.77.3.
3. **Plan doc** — wrote the two-phase plan (`16kb-rn-upgrade-plan.md`).
4. **Phase 2 scoping** — audited dependencies; found the React 18→19 wall at 0.78 means "no good middle stop" → Phase 2 is 0.81 or nothing.
5. **Execution** — installed NDK r28 + 16 KB image; did the 0.75→0.76→0.77.3 hops; hit and fixed pdf/svg/reanimated/share; dropped 32-bit ABIs; verified Android alignment on a real 16 KB emulator; built and launched iOS.
6. **Docs** — Phase 1 report + this summary.

---

## 7. What's next

### To ship Phase 1
1. **Push `feature/AIR-16kb-rn-077` and open a PR into `develop`** (currently local only).
2. **CI:** production-signed AAB + `bundletool dump config --bundle=<aab> | grep alignment` → expect `PAGE_ALIGNMENT_16K` (uses the real release keystore — a CI secret not available locally).
3. **Full functional regression QA (Juanjo), Android + iOS** — automated checks prove load + alignment; human QA proves behavior is unchanged.

### Phase 2 (optional, separate decision — only after Phase 1 ships)
RN 0.77.3 → **0.81.x** (last Old-Arch release). Not required for compliance. Crosses React 18→19 at 0.78 and forces migrations: react-query → `@tanstack/react-query` v5, react-navigation v6 → v7, Firebase v20 → v22. See plan doc §4.

### Things to watch
- The 4 pinned lib versions are tightly coupled to RN 0.77 — re-derive (by building) on any future RN bump. `react-native-svg` is pinned exactly to `15.12.1`; don't let it float to 15.13+.
- Local Android verification used a debug-signed release APK; the official Play check should run in CI with the real keystore.
- Secrets (`android/app/google-services.json`, `ios/GoogleService-Info.plist`) are gitignored and must be supplied per machine.
