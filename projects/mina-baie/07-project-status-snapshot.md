# 07 — Project Status Snapshot

**Date:** 2026-04-21
**Author:** Francisco Beccaria (Koombea)
**Client:** Mina Baie — main contact Pedro Sa Freire
**Internal PM:** Juanma Velásquez
**QA:** Juanjo

---

## 1. Global state

Three active fronts. One in final QA, one pending client notification, one pending client approval.

| # | Front | Status | Next step |
| -- | -- | -- | -- |
| A | PR #18 — Fix double Waitlist/Klaviyo button | Code ready, bug reproduced + fix validated | Final QA of zip → merge |
| B | Easy Bundle Builder "Add to Cart" (out-of-scope) | Diagnosed, not our code | Notify Pedro |
| C | Auto Featured Product every 3rd product | Investigated, estimated 12h, message sent to client | Wait for approval |

---

## 2. A — PR #18: Fix double button

### Summary

Bug reported by Pedro (2026-04-17): on sold-out variants of `Sienna Vegan Full` (and similar products), some users saw both `Add to Bag` and `Join the Waitlist` simultaneously. Intermittent, only for users without adblocker.

### Root cause (empirically confirmed)

Race condition between our JS (`DOMContentLoaded`) and Klaviyo `onsite.js`. Klaviyo checks Shopify's `variant.available` and forces `display:block !important` on `.klaviyo-bis-trigger`. When our JS hid it on variant change, Klaviyo would re-show it afterward, leaving both visible.

### Fix applied

Wrapper pattern: parent wrappers `.atc-btn-wrapper` and `.waitlist-btn-wrapper` control visibility. Klaviyo attacks the child `.klaviyo-bis-trigger` with `display:block !important`, but CSS guarantees a parent `display:none` hides children regardless of their inline styles — it's a browser rendering rule, no `!important` can override it.

### Files touched

| File | Change |
| -- | -- |
| `snippets/buy-buttons.liquid` | `.atc-btn-wrapper` + `.waitlist-btn-wrapper`, `submitWrapper` in JS, display logic per state in `applyState()` |
| `snippets/product-sticky-add-to-cart.liquid` | Same wrapper pattern for mobile sticky CTA |
| `assets/theme.css` | 3 rules: wrappers `width:100%`, force internal trigger `display:block`, hide Klaviyo auto-injected triggers |

### Playwright validation

* **Production (without fix):** `BUG_REPRODUCED: true` — switch Teddy (sold-out) → Black/Gold (in-stock) + Klaviyo re-attacks → both buttons visible.
* **Dev theme (with fix):** `FIX_WORKS: true` — same Klaviyo attack can't show the waitlist because the parent wrapper has `display:none`.

### Commits in `fix/waitlist-klaviyo-visibility`

| Hash | Iteration | What it includes |
| -- | -- | -- |
| `ed90283` | Iter 1 | Waitlist wrapper only |
| `39933f4` | Iters 2–4 | ATC wrapper, CSS rules, mobile sticky |

### Pending

1. ~~Push `39933f4` to remote and update PR #18 description~~ ✅ Done (2026-04-21)
2. Final manual QA — in progress (Juanjo has zip + dev theme `158869487867`)
3. Merge to `main` → verify Shopify ↔ GitHub auto-sync
4. If sync doesn't fire, do *Reset to latest commit* in Shopify admin

### QA final test plan

* Sienna Vegan Full, Teddy variant (`47829907767547`) sold-out → waitlist only
* Switch Teddy ↔ Black/Gold 10 times fast → never two buttons
* Mobile sticky on sold-out → waitlist sticky only
* Console with no JS errors

---

## 3. B — Easy Bundle Builder "Add to Cart" (out-of-scope)

### What's happening

During PR #18 QA it surfaced that on some variants of some products, the `Add to Bag` button is replaced by `Add to Cart` (different casing, different styles). Intermittent.

### Diagnosis

It's the **Easy Bundle Builder** app (installed as a global app-embed), not theme code. Confirmed via hashed class `pn-button-o5fnyp0twoh`, `gbbExtBundleUpsellWrapper` sibling div, missing `<button-content>` wrapper, and `config/settings_data.json:110`.

### Why it's not a PR #18 regression

The same bug happens in production before this branch.

### Pending (client action)

Message for Pedro:

> We found a separate issue that's not our code: the *Easy Bundle Builder* app is replacing the "Add to Bag" button with "Add to Cart" when switching variants on some products. It also exists in production, not a regression from this PR.
>
> Options:
>
> 1. Check in Shopify Admin → Apps → Easy Bundle Builder. If bundles aren't actively used, disable the app-embed from Online Store → Themes → Customize → App embeds.
> 2. If the app stays, most allow an allowlist of products where the button is NOT replaced.
>
> We don't recommend patching from the theme side (would require a MutationObserver fighting the app, fragile).

---

## 4. C — Auto Featured Product every 3rd

### Client request (Pedro, 2026-04-17)

Replace the current featured product system with an automatic one: every 3rd product in the collection is visually featured, based on admin order. Eliminates the need to create `collection.<name>.json` manually for each collection (12+ today).

### Solution

`position % 3 == 0` logic in `snippets/product-list.liquid`, propagate `force_highlight` flag to `product-card.liquid`. Existing CSS unchanged. Full analysis in doc 05.

### Estimate communicated to client

**12 total hours** (6h dev + 6h QA). If it takes less, we charge less.

### Status

Waiting for Pedro's approval. If approved:

1. Create branch `feat/auto-featured-every-third` from `main`
2. Implement 2 files
3. Zip → dev theme → QA
4. PR → merge

### Pending decision with client (when starting)

What to do with the 12+ old templates? Option A (full migration) recommended.

---

## 5. Summary

* **PR #18 is ready.** Only needs final QA + merge. Fix is empirically tested, not speculative.
* **Easy Bundle Builder bug** is a separate app issue. Needs Pedro's admin-side decision.
* **Auto Featured Product** is investigated and quoted. Waiting for green light from Pedro.
