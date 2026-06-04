# AIRES — QA Handoff: React Native 0.75.5 → 0.81.6 upgrade

> **For:** Juanjo (QA Engineer) · **Owner:** Francisco · **Date:** 2026-06-03
> **PR:** [#134](https://github.com/AiresIT/mobile-app/pull/134) · **Branch:** `feature/AIR-16kb-rn-077`
> **Type:** Full-app **regression** pass on **both platforms** (Android + iOS).
> **Builds are live in Firebase App Distribution (`qa-team` group)** — see §4 for versions + install.

---

## 1. What this is (one line)

A major React Native upgrade — **0.75.5 → 0.81.6** — to make the **Android build compliant with the 16 KB memory page-size requirement** (Google Play / Android 15+). It crosses **React 18 → 19** and forces several library migrations. **No intentional feature or UI changes** — so the QA goal is: **everything that worked before still works, identically, on both platforms.**

## 2. Status so far (what's already verified)

| Check | Status |
|---|---|
| Android build (CI: lint + build + sign + Firebase deploy, staging & stagingProd) | ✅ green |
| iOS build (manual GitHub Actions dispatch → Firebase) | ✅ success |
| 16 KB compliance (zipalign -P 16, 64-bit only, 19/19 native libs aligned) | ✅ pass |
| Boots to first screen, both platforms | ✅ pass |
| **Authenticated smoke test on real iOS device (login + basic navigation)** | ✅ **pass (Francisco, 2026-06-03)** |
| **Full functional regression, both platforms** | ⏳ **this handoff — Juanjo** |

The authenticated smoke test passing on-device is the key unblock: the app logs in and the main flows render on the real backend. What remains is a **thorough, behavior-level regression** by QA across all flows and both platforms.

## 3. What changed under the hood (where the risk is)

No app features were added/changed, but the foundation moved a lot. Highest-risk areas:

| Area | Before | After | Watch for |
|---|---|---|---|
| **Data layer** | `react-query@3` | **`@tanstack/react-query` v5** | All data screens: loading, pull-to-refresh, pagination ("load more"), empty + error states. **53 data hooks migrated.** |
| **Navigation** | React Navigation **v6** | **v7** | Transitions, header back, **swipe-back gesture**, tab bar, deep links. |
| **Firebase** | v20 | **v22** | App starts/logs normally; crash reporting still flows. |
| **Gestures** | (none) | **gesture-handler 2.31 added** | Swipe-back + any gesture UI; no frozen/unresponsive screens. |
| **Core** | RN 0.75.5 / React 18 | **RN 0.81.6 / React 19.1.4** | General stability; no crashes / red screens. |
| **Android target** | SDK 35 | **SDK 36 (Android 16)** | Layout/insets, status bar, bottom nav (edge-to-edge — see §6). |

Final versions: RN 0.81.6 · React 19.1.4 · @tanstack/react-query 5.100.14 · @react-navigation/native 7.2.5 · @react-native-firebase 22.4.0 · gesture-handler 2.31.2 · screens 4.24.0 · reanimated 3.19.5 · svg 15.15.5 · i18next 15.7.4 · TypeScript 5.6.3. **Old Architecture kept** (`newArchEnabled=false`), Hermes on.

## 4. Builds to test (both from PR commit `0f92dda`)

Firebase project: **`springboardpushnotification`** → **App Distribution** → group **`qa-team`**.

| Platform | Release | App ID | Notes |
|---|---|---|---|
| **iOS** | **3.3.1 (75)** | `com.AIReS.AIReSMobile.enterprise` | Enterprise-signed (Koombea Inc.) staging build. |
| **Android (staging)** | **3.3-staging (176)** | `...:android:8a0ec4869b6357c988a129` | primary build to test |
| **Android (stagingProd)** | **3.3-stagingProd (177)** | same app | secondary / prod-config variant |

**Install:**
- Make sure your devices/email are in the **`qa-team`** tester group (Firebase Console → App Distribution → Testers & Groups).
- **iOS first-run:** the app is enterprise-signed, so after install iOS shows **"Untrusted Enterprise Developer"**. Trust it once: **Settings → General → VPN & Device Management → Koombea Inc. → Trust**. Then the app opens. (One-time per device.)
- Prefer testing Android on a **16 KB page-size device** if available, plus a normal device.

> Note: iOS does **not** run on PR CI — **your manual iOS pass is the iOS verification gate.** Android has CI build+sign+deploy plus your pass.

## 5. Test focus — by flow (run each on BOTH platforms; ⭐ = highest risk)

**Auth & entry**
- ⭐ Login (username + password), SSO login
- ⭐ MFA / OTP (select method, validate)
- Forgot password, reset password, security questions
- Biometrics login (Face ID / fingerprint)

**Core data screens (TanStack v5 — watch loading / refresh / pagination / error)**
- ⭐ Home, Active Relocations
- ⭐ Services + all sub-services (Area Tour, Auto Rental, Cultural Training, Education, Furniture, Home Purchase/Sale/Search, Language, Meet & Greet, Passport, **Property Management**, Temporary Housing, Travel, Visa)
- ⭐ Expenses + Expense Form (list, new, new item, details) — incl. **infinite scroll / load more**
- ⭐ Payment Accounts (list + ACH/Check/Wire — view, create, edit, delete)
- Comments / Expense Comments / Service Comments (infinite scroll)
- Calendar (events render, month navigation)
- Checklist (list, detail, add task, toggle items)
- Documents / Shipments / Shipment Details / Contact Us / About Us / Privacy Policy

**Navigation (v7)**
- ⭐ Back button + **swipe-back gesture** (both platforms)
- Tab bar switching; deep links / universal links (open app to correct screen)

**Native features**
- PDF viewer, Share, Image picker (upload a receipt), WebView screens, file-format support

**App lifecycle**
- Background → foreground, app-version-check / update modal, language switching (i18n)

## 6. Android 16 / edge-to-edge — pay special attention

targetSdk is now **36 (Android 16)**, which tightens edge-to-edge. We set `edgeToEdgeEnabled=false` to preserve current layout, but verify on Android:
- Status bar / notch — no content hidden under it
- Bottom nav / home indicator — no content cut off or overlapping
- `SafeAreaView` screens — correct top/bottom padding

If anything looks shifted vs. current production, flag it — most likely *visual* regression from this upgrade.

## 7. Known / expected — NOT bugs (don't file)

- Console deprecation warnings (harmless, intentional):
  - "SafeAreaView has been deprecated…"
  - "running using the Legacy Architecture…" (we intentionally stay on Old Arch)
  - "…Firebase namespaced API … deprecated … use getApp()/recordError()" (calls still work)
- iOS dev builds: yellow "Open debugger to view warnings" banner — dev indicator, not an error.
- iOS "Untrusted Enterprise Developer" on first install — expected; trust per §4.

## 8. Two spots to verify closely (possible pre-existing bugs surfaced by the upgrade)

Flagged by stricter typing during the upgrade — **may or may not be real**, please confirm behavior:
1. **Copyright text** (login area / `LoginMethodSelector`): confirm the copyright string displays.
2. **Expense form payment account** (`ExpenseFormDetails`): confirm the payment-account **description** shows on the expense detail screen.

## 9. Reporting

- File issues per platform (Android-only / iOS-only / both).
- Include: screen, steps, expected vs actual, screenshot/video, **build version** (§4).
- Expect a **fix → re-test loop**, not a single pass — normal for an upgrade this size.

## 10. Scope boundary

Upgrade-only PR. If a bug also exists in **current production**, note it as pre-existing — shouldn't block this PR, but good to capture.

## 11. After QA

- Francisco fixes anything found → re-verify → re-build/distribute as needed.
- On QA sign-off: review/approve PR #134 → merge to `develop`.
- **Heads-up:** merging puts develop on RN 0.81.6 — other in-flight branches (e.g. AIR-508, AIR-636, docs) will inherit the upgrade on their next merge with develop. Notify those owners before merge.
