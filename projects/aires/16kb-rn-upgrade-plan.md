# AIRES — React Native Upgrade Plan for Android 16 KB Compliance (CR011)

> **Status:** Plan (execution not started)
> **Author/driver:** Francisco Beccaria (Koombea)
> **Created:** 2026-05-29
> **Base branch:** `develop` (61 commits ahead of `main`; team integrates on `develop`)
> **Supersedes:** Mario's `16kb-upgrade-plan` and the Gemini/ChatGPT external research drafts. This is the single source of truth.

---

## 0. TL;DR

Two **independently shippable** phases:

| Phase | Goal | RN target | React | Mandatory? |
|---|---|---|---|---|
| **Phase 1** | Android 16 KB compliance (CR011) | **0.77.3** | 18 (unchanged) | ✅ Yes — satisfies the CR alone |
| **Phase 2** | Modernization to last Old-Arch release | **0.81.x** | 19 | ❌ Optional — go/no-go **after** Phase 1 ships |

**Hard constraints (both phases):** keep `newArchEnabled=false`, keep Hermes, keep `AppDelegate.mm` (Objective-C++), do not adopt the New Architecture.

**The deadline** for Play Store 16 KB compliance is internally extended to **Feb 2027**, so there is no rush — but Phase 1 is small enough to ship quickly with quality.

---

## 1. Why these targets (decision record)

### Phase 1 → RN 0.77.3
- RN **0.77** is the **first release where React Native officially declares full 16 KB page-size support** (verbatim: *"React Native is ready to fully support 16 KB page size"*). The 0.77 changelog adds the Android CMake arguments for 16 KB-aligned native libraries.
- **0.77 still ships React 18** — React 19 arrives in 0.78. Staying on 0.77 means near-zero JS migration.
- **0.77.3** (latest patch in the line) rather than 0.77.0 — patch releases carry the critical fixes.
- 0.75 (current) is **not** viable — needs manual CMake flags that don't propagate to prebuilt prefab artifacts. 0.76 is only *partial* and flips New Arch on by default, so it's a poor stop point.

This conclusion is corroborated by **four independent analyses** (internal + Gemini + ChatGPT deep research); the three that did fresh research all landed on **0.77**.

### Phase 2 → RN 0.81.x (the only sensible non-0.77 stop)
- **0.81 is the last release where `newArchEnabled=false` works.** 0.82 silently **ignores** the flag and runs New Arch only. So 0.81 is the absolute ceiling under our "no New Arch" constraint.
- **There is no good intermediate stop (0.78 / 0.79 / 0.80).** The React 18→19 wall is at **0.78**. Crossing it forces the full React-19 migration cost (see §4) regardless of whether you stop at 0.78 or 0.81 — but only 0.81 delivers the meaningful "last Old-Arch checkpoint" payoff. Stopping at 0.78–0.80 pays the toll without the reward.
- **Phase 2 is therefore binary:** skip it, or go all the way to 0.81.

> **Honest framing for the client:** "0.77/0.81 + Old Architecture" is a **bridge strategy, not an end state.** No currently-supported RN version both is in active support *and* permits the Legacy Architecture. The eventual New Architecture migration is a separate, future CR.

---

## 2. Current baseline (verified in repo)

| Item | Current |
|---|---|
| react-native | 0.75.5 |
| react | 18.3.1 |
| newArchEnabled | `false` ✅ |
| hermesEnabled | `true` ✅ |
| ndkVersion | 26.1.10909125 |
| AGP | 8.5.0 |
| compileSdk / targetSdk | 35 / 35 |
| minSdk | 30 |
| Kotlin | 1.9.25 |
| ABIs | `armeabi-v7a,arm64-v8a,x86,x86_64` (32-bit still present) |
| iOS entry | `ios/Aires/AppDelegate.mm` (Objective-C++) |

**React-19 risk surface (already audited):** 1 file uses `propTypes/defaultProps`, **0 class components**, **0 deep `react-native/Libraries` imports**. The codebase is clean — React 19 *core* migration is trivial; cost lives entirely in dependencies (§4).

**Cleanup while in `package.json`:** remove accidental deps `"add"` and `"yarn"`.

---

## 3. Phase 1 — RN 0.75.5 → 0.77.3 (mandatory, React 18)

### Tooling targets
| Item | Target | Note |
|---|---|---|
| react-native | **0.77.3** | |
| ndkVersion | **r28 (28.x)** | Google's official "16 KB by default" recipe is **AGP 8.5.1+ AND NDK r28+**. r27 only works because RN core prebuilts are pre-aligned — r28 also covers misaligned **third-party** `.so`. |
| AGP | **8.6+** | Avoid the AGP 8.3–8.5.0 "deceptive alignment" trap (local APK looks aligned, Play AAB isn't). |
| Gradle | 8.10.2 | per 0.77 baseline |
| Kotlin | 2.0.21 | per 0.77 baseline |
| compileSdk / targetSdk | 35 / 35 | unchanged |
| newArchEnabled | `false` | keep |

### Steps
1. **Branch off `develop`:** `git checkout develop && git pull && git checkout -b feature/AIR-XXX/16kb-rn-077`. Open a draft PR so CI tracks.
2. **Baseline build today** on 0.75.5 (Android + iOS green) and capture the "before" ELF/AAB alignment. If the baseline is broken, fix it first.
3. **Hop 0.75 → 0.76** via Upgrade Helper. Checkpoint/tag (`upgrade/rn-0.76`). Keep `newArchEnabled=false`, `RCT_NEW_ARCH_ENABLED=0` in Podfile. Smoke build.
4. **Hop 0.76 → 0.77.3** via Upgrade Helper. Apply only the changes RN's diff requires.
   - **iOS:** keep `AppDelegate.mm`; add the `RCTAppDependencyProvider` wiring (required from 0.77 when staying Obj-C++).
   - **Android:** set NDK r28, AGP 8.6+, `useLegacyPackaging` only if you remain on NDK r27.
   - Bump **only** libraries that break the build (likely: reanimated, screens; add `react-native-gesture-handler` as an explicit peer dep). Do **not** preemptively bump everything.
5. **Cache wipe between hops** (the #1 cause of phantom 16 KB failures): `node_modules`, `ios/Pods`, `~/.gradle/caches`, `android/.gradle`, `android/app/build`, Xcode DerivedData.

### Phase 1 validation (the real gate — version number is just a means)
Build a **release** AAB **and** APK, then:
```bash
bundletool dump config --bundle=app-release.aab | grep alignment   # expect PAGE_ALIGNMENT_16K
zipalign -c -P 16 -v 4 app-release.apk                              # expect "Verification successful"
check_elf_alignment.sh app-release.apk                             # every .so ALIGNED / ELF Verification Successful
adb shell getconf PAGE_SIZE                                         # expect 16384 (on 16 KB emulator)
```
- If a **third-party `.so`** fails → bump that one lib, or drop 32-bit ABIs (§3, final step).
- **Backcompat mode is NOT a pass.** If the device reports running in 16 KB backcompat mode, treat as failure.
- iOS regression smoke build (0.77 changes startup wiring + Pods).

### Phase 1 final step — drop 32-bit ABIs (gated, reversible)
```properties
reactNativeArchitectures=arm64-v8a,x86_64
```
16 KB devices are 64-bit only. Halves APK size and removes the `.so` files most likely to fail alignment. Do this last so it can be reverted independently.

### Phase 1 exit criteria
- `package.json` → `react-native: 0.77.3`; `newArchEnabled=false`; Hermes on.
- AAB reports `PAGE_ALIGNMENT_16K`; APK passes `zipalign`; all `.so` ELF-aligned; app runs on 16 KB emulator with no backcompat warning.
- iOS builds + launches.
- Tag `checkpoint/rn-0.77.3-16kb-ok` → hand to QA (Juanjo) for full regression.

**At this point CR011 is satisfied and shippable.** Phase 2 is a separate decision.

---

## 4. Phase 2 — RN 0.77.3 → 0.81.x (optional, React 19)

> Decide **go/no-go after Phase 1 ships.** Bounded but real. The cost is **3 dependency migrations**, not RN core.

### The React 18→19 wall (at 0.78) forces these — from the actual dependency audit:
| Dependency | Current | Required for React 19 / 0.81 | Why |
|---|---|---|---|
| `react-query` | 3.39.3 (legacy) | **`@tanstack/react-query` v5** | v3 predates `useSyncExternalStore`; **fundamentally incompatible with React 19.** Real data-layer API migration. **The biggest single cost.** |
| `@react-navigation/*` | v6 | **v7** | Last Old-Arch-compatible major. `headerBackTitleVisible` → `headerBackButtonDisplayMode`, etc. |
| `@react-native-firebase/*` | 20.4.0 | **22.x** (modular API) | v24 only needed for RN 0.85; keep on Old-Arch-safe 22. |
| `react-i18next` | 13 | 14/15 | React-19-sensitive. |
| `react-native-reanimated` | 3.19.0 | **3.19.5** (NOT 4.x) | 4.x requires New Arch. |
| `react-native-screens` | ^3.27 | **^4.24** (NOT 4.25+) | 4.25+ drops Old Arch. |
| Metro + Firebase (RN 0.79) | — | `resolver.unstable_enablePackageExports = false` | One-line `metro.config` fix for Firebase CommonJS resolution. |

### Tooling deltas vs Phase 1
- compileSdk/targetSdk **36/36** (Android 16), AGP 8.10+, Gradle 8.14.1, Kotlin 2.1.20.
- Node 20.19.4+, Xcode 16.1+ (0.81 local requirements).
- Edge-to-edge: already enforced today by `targetSdk 35`; 0.81/Android 16 tightens it. Migrate remaining `SafeAreaView` (11 files) toward `useSafeAreaInsets` (6 files already use it).

### Execution
Incremental, checkpoint each minor: 0.77.3 → 0.78 → 0.79 → 0.80 → 0.81.x. Run the same §3 validation suite at each hop. The React-19 dependency migrations all land at the **0.78** hop — concentrate QA there.

### Phase 2 exit criteria
- RN 0.81.x; `newArchEnabled=false` still honored; React 19.
- 16 KB validation still green.
- Full regression QA (Android + iOS).

---

## 5. Risk register

| Risk | Phase | Mitigation |
|---|---|---|
| Third-party `.so` misaligned despite RN core being aligned | 1 | NDK r28; per-`.so` audit; drop 32-bit ABIs |
| AGP 8.3–8.5.0 "looks aligned locally, Play AAB isn't" | 1 | AGP 8.6+; validate the **AAB**, not just local APK |
| `react-query` v3 breaks under React 19 | 2 | Migrate to `@tanstack/react-query` v5 (planned, scoped) |
| Firebase Metro `exports` resolution break | 2 | `unstable_enablePackageExports = false` |
| iOS Pods / provisioning blockers | 1 & 2 | Clean-room pod reinstall; escalate to Mario for iOS provisioning |
| Active development on `develop` drifts | both | Rebase upgrade branch on `develop` regularly |

---

## 6. Open items to confirm with client/PM
- The exact internal deadline (Feb 2027 per latest note) and whether Phase 2 is in scope/budget.
- Budget split (162h total vs 90h dev) — does not affect the technical target.
- Whether the client values the "last Old-Arch checkpoint" (the only reason to do Phase 2 before the eventual New-Arch CR).

---

## 7. Execution readiness (local machine — verified 2026-05-29)

No external access, credentials, purchases, MCPs, or third-party services are required. Everything needed for Phase 1 — including the static 16 KB alignment proof **and** the on-device 16 KB emulator test — is installable locally.

### Already present and sufficient
- ✅ Node 20.19.5, Yarn 1.22 + `yarn.lock`
- ✅ Android SDK at `~/Library/Android/sdk` (`adb`, `emulator` present)
- ✅ JDK via Android Studio's bundled JBR (`/Applications/Android Studio.app/Contents/jbr/Contents/Home`) — works for Gradle
- ✅ Xcode 16.2, CocoaPods 1.16.2

### Gaps to close at execution time (all are simple `sdkmanager` downloads — no purchase/access)
| Gap | Current | Needed | For |
|---|---|---|---|
| **NDK** | r26.1.10909125 only | **r28.x** (`sdkmanager "ndk;28.x"`) | 16 KB-aligned build by default |
| **16 KB system image** | only standard `android-36.1` AVD | "16 KB Page Size" image | runtime proof `getconf PAGE_SIZE → 16384` |
| **Shell env** | `ANDROID_HOME`/`JAVA_HOME` not exported in non-interactive shell | set inline per command | Gradle builds; no system change required |
| **Ruby (rbenv)** | 2.6.10 (old) | ~3.x | **Phase 2 only** — iOS `bundle exec pod install`; not needed for Phase 1 Android |

### Division of labor
- **Agent can do end-to-end:** branch off `develop`, Upgrade Helper hops, all `package.json`/Gradle/`gradle.properties`/`Podfile`/`AppDelegate.mm`/Metro edits, `yarn install`, install NDK r28 + 16 KB image via `sdkmanager`, build the release AAB/APK, and run the full `bundletool`/`zipalign`/`check_elf_alignment.sh`/emulator validation suite.
- **Requires a human/CI:** Play Console upload and the final functional regression QA (Juanjo).

### Agreed execution parameters (when greenlit)
- Install **both** NDK r28 and the 16 KB system image (approved).
- Execute **all of Phase 1 in one pass**, review at the end.
- Base branch: **`develop`** (not `main`).
