# 03 — Next Steps (ordered plan to finish)

## Step 1 — Apply the 12 nav v7 `navigate()` fixes on PR #134
All are **same-stack backward navigations** ("return to a screen the user came
from") that v7 turns into duplicate pushes. Fix = `navigate('X', params)` →
`popTo('X', params)`. `popTo` is available in the installed v7 routers.

**Payment accounts (9)** — return-to-list after create/edit/delete:
| File | Lines |
|---|---|
| `src/screens/paymentAccounts/ach/ACHPaymentAccount.screen.tsx` | 155 |
| `src/screens/paymentAccounts/ach/ACHPaymentAccountForm.screen.tsx` | 247, 261 |
| `src/screens/paymentAccounts/check/CheckPaymentAccount.screen.tsx` | 146 |
| `src/screens/paymentAccounts/check/CheckPaymentAccountForm.screen.tsx` | 230, 244 |
| `src/screens/paymentAccounts/wire/WirePaymentAccount.screen.tsx` | 189 |
| `src/screens/paymentAccounts/wire/WirePaymentAccountForm.screen.tsx` | 289, 303 |

**Expense forms (3)** — return-to-list after submit:
| File | Lines |
|---|---|
| `src/screens/expenseForm/ExpenseFormNew.screen.tsx` | 230, 367, 413 |

**Login (3)** — return to username screen:
| File | Lines | Note |
|---|---|---|
| `src/screens/login/LoginPassword.screen.tsx` | 133 | login-failure error return (keep the `loginError` param) |
| `src/screens/login/ResetPassword.screen.tsx` | 99 | after reset success |
| `src/hooks/app/useAppNavigation.ts` | 12 | `navigateToLoginUsername` helper (used in 4 LoginMethodSelector flows) |

### ⚠️ Do NOT change (verified NOT regressions)
- `src/screens/More.screen.tsx:150` — **forward** (Banking menu opening
  PaymentAccounts). Leave as `navigate`.
- `src/screens/login/LoginPassword.screen.tsx:109` — "continue to web" flow;
  audit-rejected as a false alarm. Leave as `navigate`.
- The other ~57 `navigate()` calls — forward navigation, identical in v6/v7.

> Per-site care matters: do NOT blanket find-replace `navigate`→`popTo`. Only the
> 12 above. The exclusions are real.

## Step 2 — Silence Crashlytics v22 deprecation warnings (1 line)
Add at app startup (e.g. top of `src/App.tsx` or index):
```js
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
```
Crash reporting already works; this only quiets the console noise QA sees. The
full modular-API migration (~30 call sites) is a **separate follow-up ticket**,
not upgrade-blocking.

## Step 3 — Verify & push #134
```
npx tsc --noEmit        # expect no NEW errors vs the b8002b0 baseline (~94/98)
npx eslint <changed files>
git commit -m "fix(nav): use popTo for v7 backward navigation (AIR-16kb)"
git push origin feature/AIR-16kb-rn-077
```
Confirm CI stays green (gh pr checks 134).

## Step 4 — Review & re-QA (targeted)
- **Erika** reviews the receipt-picker migration (her AIR-636 feature on the new
  `@react-native-documents/picker`).
- **QA (Juanjo)** re-tests ONLY the changed flows on a new build, both platforms:
  - Login failure → returns to username (no duplicate)
  - Reset password success → returns to username
  - Payment accounts: create/edit/delete each (ACH/Check/Wire) → returns to list (no duplicate)
  - Expense form submit → returns to list (no duplicate)
  - Receipt upload "Select file" (PDF/Word/Excel) works via the new picker

## Step 5 — Rebuild the combined 3.5 branch
Once #134 is final:
```
git switch -c feature/AIR-3.5-combined-v2 origin/feature/AIR-16kb-rn-077
git cherry-pick <AIR-540> <AIR-541> <AIR-544 commits>   # now clean
# verify, push, update/replace PR #141
```
(540/541/544 cherry-picks were clean before; the only earlier conflicts came from
the stale upgrade base, which is now fixed.)

## Step 6 — Follow-up tickets (don't block 3.5)
- Crashlytics → modular Firebase API migration (whole app).
- Optional: a `QueryClient` `defaultOptions` refactor to remove the 53× zero-cache
  hook boilerplate (noted in the #134 review).
