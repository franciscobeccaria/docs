## PR #9 — Core Integration

**Branch:** `fix/waitlist-fa-integration`
**Merged:** 2026-03-27
**Title:** `fix: integrate FA pre-order logic with Klaviyo waitlist`

### What it fixed

The b.solutions FA code had three bugs that broke the waitlist:

1. Button text was hardcoded to "OUT OF STOCK" instead of "Join the Waitlist"
2. A JS function blocked all clicks on the waitlist button
3. Pre-order logic only handled two states (Pre-Order / Add to Bag) — no Sold Out / Waitlist state

### What it delivered

* Three-state logic: In Stock / Pre-Order / Sold Out, driven by FA metafields
* Server-side Liquid render (no blink on page load — correct state from first paint)
* Client-side JS for dynamic variant switching and cart-aware transitions
* Cart quantity awareness: when cart qty reaches `onhandstock`, switches to Pre-Order
* `cart:change` and `cart:refresh` event listeners to stay in sync with cart updates
* Mobile sticky CTA (`product-sticky-add-to-cart.liquid`) aligned to same states
* "Join the Waitlist" on mobile sticky for sold-out variants
* Klaviyo subscription capture verified: correct variant ID, product name, SKU

### Files changed

* `snippets/buy-buttons.liquid`
* `snippets/product-sticky-add-to-cart.liquid`

---

## PR #14 — Remove "Please note:" Prefix

**Branch:** `fix/remove-please-note-prefix`
**Merged:** 2026-04-09
**Title:** `fix: remove "Please note:" prefix from pre-order line item property`

### Background

Shopify always renders line item properties as `Key: Value` in the admin. The hidden input was named `properties[Please note]`, so orders showed:

```
Please note: Pre-order item. Est ship date May 1st. All items in this order will ship together.
```

Pedro requested removing the "Please note:" prefix for cleaner admin display.

### What changed

Renamed `properties[Please note]` → `properties[Pre-order]` and removed the redundant "Pre-order item." text from the value. Orders now show:

```
Pre-order: Est ship date May 1st. All items in this order will ship together.
```

The hidden input uses the `disabled` attribute (not `value=""`) when the variant is not a pre-order, so it's excluded from `FormData` entirely — no property appears on non-pre-order orders.

### Files changed

* `snippets/buy-buttons.liquid` — 4 changes: Liquid assignment, HTML input name, JS value strings (with date / without date)

---

## PR #18 — Fix Klaviyo Overriding Waitlist Visibility

**Branch:** `fix/waitlist-klaviyo-visibility`
**Status:** In QA as of 2026-04-17
**Title:** `fix: prevent Klaviyo from overriding waitlist button visibility`

### Root cause

Klaviyo's `onsite.js` independently checks Shopify's native `variant.available` field and sets `display:block` on `.klaviyo-bis-trigger` elements when it considers a variant unavailable. Our code uses FA metafields as the source of truth, which can disagree with Shopify's inventory count. When Klaviyo ran after our `DOMContentLoaded` JS, it won the race condition and showed both "Add to Bag" and "Join the Waitlist" simultaneously.

This was intermittent because users with adblockers blocking Klaviyo's script never saw the conflict.

### Fix

Wrapped the waitlist button in a `<div class="waitlist-btn-wrapper">`. Our JS controls the wrapper's visibility. Klaviyo targets `.klaviyo-bis-trigger` directly and cannot override a parent element's `display:none` — CSS guarantees parent `display:none` hides all children regardless of child inline styles.

```html
<!-- Before -->
<button class="klaviyo-bis-manual-btn klaviyo-bis-trigger ..." style="{{ waitlist_button_display }}">
  Join the Waitlist
</button>

<!-- After -->
<div class="waitlist-btn-wrapper" style="{{ waitlist_button_display }}">
  <button class="klaviyo-bis-manual-btn klaviyo-bis-trigger ...">Join the Waitlist</button>
</div>
```

JS selector updated from `.klaviyo-bis-trigger` → `.waitlist-btn-wrapper`.

### Files changed

* `snippets/buy-buttons.liquid`

---

## Technical Decisions

### FA metafields as source of truth

Shopify's native `available` field and FA metafields can disagree (e.g., FA says `onhandstock > 0` but Shopify shows inventory = 0 because they're separate systems). We use FA metafields as the authoritative source for button state, and only fall back to Shopify's `available` for the Sold Out / waitlist case.

### Server-side render + client-side sync

Liquid renders the correct initial state to avoid a visible button swap (blink) on page load. The JS block then handles all subsequent changes: variant switches, quantity changes, cart events.

### `disabled` vs empty string for pre-order input

Using `disabled` attribute (not `value=""`) on the hidden pre-order input ensures it's excluded from `FormData` on non-pre-order orders. An empty-string value would still appear in the order as `Pre-order: ` — disabled excludes it entirely.
