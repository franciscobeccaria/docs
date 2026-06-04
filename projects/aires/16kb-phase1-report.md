# AIRES — 16 KB Upgrade · Phase 1 Report & Next Steps

> **Status:** ✅ Phase 1 complete and verified locally (not yet pushed, not yet QA'd)
> **Date:** 2026-06-01
> **Branch:** `feature/AIR-16kb-rn-077` (based on `develop`)
> **Plan reference:** [`16kb-rn-upgrade-plan.md`](./16kb-rn-upgrade-plan.md) — read that first for the *why*; this doc is the *what was done* and *what's next*.

---

## 0. How to read this (for the next person — human or LLM)

1. Read [`16kb-rn-upgrade-plan.md`](./16kb-rn-upgrade-plan.md) → the strategy, version decisions, and Phase 2.
2. Read this report → exactly what Phase 1 changed, how it was verified, and the open items.
3. Pick up at **§6 Next steps**.

The work lives on branch `feature/AIR-16kb-rn-077`, **6 commits**, **not pushed**. Nothing is on `main`/`develop` yet.

---

## 1. What Phase 1 achieved

Made the **Android** build of AIRES compliant with the **16 KB memory page-size** requirement (Google Play, Android 15+), by upgrading **React Native 0.75.5 → 0.77.3** while keeping the **Old Architecture** (`newArchEnabled=false`) and **Hermes**. iOS was kept building on the conservative **Objective-C++ `AppDelegate.mm`** path (no Swift migration).

RN 0.77 is the first release with official full 16 KB support, and it stays on **React 18** (React 19 lands in 0.78) — so this is the lowest-churn version that meets the requirement.

**Verified result:** 19/19 native `.so` files 16 KB-aligned, both platforms build and launch.

---

## 2. Commits (in order)

| Commit | Summary |
|---|---|
| `8d4be31` | `chore(upgrade): RN 0.75.5 -> 0.76.9 (Phase 1, hop 1)` |
| `97b1c52` | `chore(upgrade): RN 0.76.9 -> 0.77.3 (Phase 1, hop 2)` |
| `ae9a974` | `fix(16kb): react-native-pdf 6.7.x -> 7.0.4 for 16 KB alignment` |
| `f6d4275` | `chore(16kb): drop 32-bit ABIs (arm64-v8a, x86_64 only)` |
| `7b2218c` | `fix(16kb): react-native-svg 14.x -> 15.x for RN 0.77` |
| `eac958f` | `fix(ios): align native libs to RN 0.77 Fabric/Yoga ABI; iOS builds` |

---

## 3. Final configuration (after Phase 1)

### Core / toolchain
| Item | Before | After |
|---|---|---|
| react-native | 0.75.5 | **0.77.3** |
| react | 18.3.1 | 18.3.1 (unchanged) |
| NDK | 26.1.10909125 | **28.2.13676358 (r28c)** |
| Kotlin | 1.9.25 | **2.0.21** |
| Gradle wrapper | 8.8 | **8.10.2** |
| compileSdk / targetSdk | 35 / 35 | 35 / 35 (unchanged) |
| minSdk | 30 | 30 (unchanged) |
| iOS deployment target | 13.4 | **15.1** |
| ABIs packaged | armeabi-v7a, arm64-v8a, x86, x86_64 | **arm64-v8a, x86_64** |
| newArchEnabled | false | **false** (kept) |
| Hermes | on | on (kept) |
| iOS entry point | `AppDelegate.mm` (Obj-C++) | `AppDelegate.mm` + `RCTAppDependencyProvider` |
| Ruby (`.ruby-version`) | 3.1.2 (not installed) | **3.3.5** |

### Third-party native libraries (the real work — see §4)
| Library | Before | After | Reason |
|---|---|---|---|
| react-native-pdf | ^6.7.4 (→6.7.7) | **^7.0.1** (→7.0.4) | 6.x shipped a 4 KB-aligned `libpdfiumandroid.so` |
| react-native-svg | ^14.1.0 (→14.2.0) | **15.12.1** (pinned) | 14.x fails RN 0.77 Android compile; 15.13+ breaks iOS Yoga |
| react-native-reanimated | 3.19.0 | **~3.16.7** | 3.19 uses a RN 0.78+ Fabric field (`parentTag`) |
| react-native-share | ^10.2.1 | **^12.3.1** | 10.x codegen spec header not produced on RN 0.77 |

### Code changes
- `SoLoader.init(this, OpenSourceMergedSoMapping)` in `MainApplication.kt` (RN 0.76 merged native libs into `libreactnative.so`).
- `RCTAppDependencyProvider` wiring added to `AppDelegate.mm` (required from RN 0.77 to resolve autolinked modules without migrating to Swift).
- Explicit `ndk { abiFilters "arm64-v8a", "x86_64" }` in `android/app/build.gradle` + `reactNativeArchitectures=arm64-v8a,x86_64` in `gradle.properties`.
- Removed junk deps `add` and `yarn` from `package.json`.

---

## 4. The key lesson (why this took iteration)

**The RN core bump was easy. The cost was 4 third-party native libraries**, each needing a version matched to RN 0.77's exact C++/Yoga/codegen ABI — and Android and iOS pulled in **opposite directions**:

- **Android** needs some libs *newer* (svg ≥15 for `BaseViewManagerInterface`; pdf ≥7 for alignment).
- **iOS Fabric** needs those same libs *older* (reanimated 3.16 not 3.19; svg 15.12 not 15.13+, because newer ones call RN 0.78+ APIs that don't exist in 0.77).
- **svg 15.12.1** is the sweet spot satisfying both.

None of this was visible from version numbers — it was caught only by **building both platforms and running the ELF audit**. That is exactly why the plan makes *build + audit* the gate, not the version. **Any future RN bump should expect the same: budget for per-library ABI matching, verified by building, not by reading changelogs.**

---

## 5. Verification evidence

All checks run locally on this machine.

### Android (the compliance requirement)
- ✅ `./gradlew assembleStagingRelease` — BUILD SUCCESSFUL (debug-signed locally; release keystore is a CI secret).
- ✅ **ABIs in APK:** `lib/arm64-v8a`, `lib/x86_64` only (32-bit dropped).
- ✅ **`zipalign -c -P 16 -v 4`** → "Verification successful".
- ✅ **ELF alignment** (`llvm-readelf` from NDK r28) on `.so` extracted from the APK: **19/19 arm64 `.so` aligned ≥16 KB (0x4000), 0 misaligned.**
- ✅ **On-device:** AVD from `system-images;android-35;google_apis_ps16k;arm64-v8a` → `adb shell getconf PAGE_SIZE` = **16384**. App installed, launched, `nativeloader` loaded libs `ok`, no SIGSEGV / no alignment crash.

### iOS (regression guard — must still build/run)
- ✅ `Development` scheme → **`** BUILD SUCCEEDED **`** on iPhone 16 simulator.
- ✅ App installed + launched (`com.AIReS.AIReSMobile.dev`), stayed alive, no crash / no fatal log.
- ✅ Obj-C++ `AppDelegate.mm` + `RCTAppDependencyProvider` + Hermes + Firebase all compile and run.

### How to re-run the Android audit
```bash
cd android
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
./gradlew assembleStagingRelease \
  -PAPP_STORE_FILE=debug.keystore -PAPP_STORE_PASSWORD=android \
  -PAPP_KEY_ALIAS=androiddebugkey -PAPP_KEY_PASSWORD=android
APK=app/build/outputs/apk/staging/release/app-staging-release.apk
"$ANDROID_HOME"/build-tools/36.1.0/zipalign -c -P 16 -v 4 "$APK"   # expect "Verification successful"
# ELF check: extract lib/arm64-v8a/*.so and verify each LOAD segment align >= 0x4000 with llvm-readelf
```

---

## 6. Next steps

### To sign off Phase 1 (before shipping)
1. **Push the branch and open a PR into `develop`** (currently local-only).
2. **CI: production-signed AAB + Play-level check** — run `bundletool dump config --bundle=<app.aab> | grep alignment` (expect `PAGE_ALIGNMENT_16K`) using the **real release keystore** (CI secret, not available locally). Optionally validate via Play Console's App Bundle Explorer.
3. **Full functional regression QA (Juanjo), Android + iOS** — automated checks prove it loads and aligns; human QA proves it *behaves* the same as before (login, biometrics, navigation, image picker, PDF, share, WebView, deep links).

### Environment / setup notes for the next machine
- Android: needs JDK 17+ (Android Studio JBR works), Android SDK, **NDK r28**, and the **16 KB system image** (`sdkmanager` installs).
- iOS: needs **Ruby ≥3.x** (rbenv), `bundle install`, then `bundle exec pod install` (generates the `ReactAppDependencyProvider` codegen pod).
- **Secrets (gitignored, must be supplied locally):** `android/app/google-services.json`, `ios/GoogleService-Info.plist`.

### Phase 2 (optional — separate decision)
RN 0.77.3 → **0.81.x** (last Old-Arch release). This is *not* required for compliance; it's modernization. It crosses the React 18→19 wall at 0.78 and forces additional dependency migrations (react-query → `@tanstack/react-query` v5, react-navigation v6 → v7, Firebase v20 → v22). See the plan doc §4. **Do not start Phase 2 until Phase 1 is shipped and QA'd.**

---

## 7. Risks / things to watch
- The 4 pinned library versions are **tightly coupled to RN 0.77**. If anyone bumps `react-native`, expect to re-derive these (especially reanimated and svg) by building both platforms.
- `react-native-svg` is **pinned exactly** to `15.12.1` (no `^`) on purpose — do not let it float to 15.13+ (breaks iOS).
- The local Android verification used a **debug-signed** release APK. Alignment is identical regardless of signing, but the official Play artifact check should still run in CI with the real keystore.
- iOS was verified to **build and launch**, not full functional QA — that's Juanjo's pass.
