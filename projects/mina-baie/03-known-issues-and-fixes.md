## Issue 1 — Both buttons showing simultaneously

**Reported by:** Pedro (client), April 2026
**Status:** Fixed in PR #18 (in QA)

**Symptom:** "Add to Bag" and "Join the Waitlist" both visible on the same product variant. Intermittent — only users without adblockers saw it.

**Root cause:** Race condition between our JS and Klaviyo's `onsite.js`. Klaviyo targets `.klaviyo-bis-trigger` elements and forces `display:block` when Shopify's `variant.available` is false. Our code uses FA metafields (a separate data source) which can say the variant is in stock while Shopify says it's unavailable. Klaviyo ran after our code and won.

**Fix:** Wrapped the waitlist button in a parent `div.waitlist-btn-wrapper`. We control the parent's display. Klaviyo can override the child button all it wants — the parent's `display:none` still hides it.

---

## Issue 2 — Shopify/GitHub sync dropping PR merges

**Encountered:** April 2026 (after PR #14 merge)
**Status:** Resolved with "Reset to latest commit"

**Symptom:** PR merged to `main` on GitHub but the live Shopify theme didn't update.

**Root cause:** Documented Shopify GitHub sync reliability issue — the sync service can silently drop events intermittently. Not related to our code. PR #13 (merged 4.5 hours earlier) synced fine; PR #14 did not.

**Fix:** In Shopify admin → Online Store → Themes → connected theme → "Reset to latest commit". This manually re-pulls current GitHub HEAD. When it ran: 1,542 files succeeded, 6 failed (pre-existing PageFly errors unrelated to our work).

**Going forward:** After every merge to main, verify the Shopify theme updated. If it didn't, use "Reset to latest commit". No need to disconnect/reconnect the GitHub integration.

---

## Issue 3 — "Please note" appearing on pre-order orders

**Reported by:** Pedro, April 2026
**Status:** Fixed in PR #14

**Symptom:** Pre-order line items in Shopify admin showed:

```
Please note: Pre-order item. Est ship date May 1st. All items in this order will ship together.
```

**Root cause:** Shopify always renders line item properties as `Key: Value`. The hidden input was `name="properties[Please note]"` — the "Please note:" prefix is the property key, not text we wrote. There's no way to show just the value without a key.

**Fix:** Renamed the property to `properties[Pre-order]` and cleaned up the value string. Admin now shows:

```
Pre-order: Est ship date May 1st. All items in this order will ship together.
```

---

## Issue 4 — Empty "Please note" appearing on non-pre-order orders

**Reported by:** Pedro, April 2026
**Status:** Was a cached cart issue, not a code bug. Resolved itself after cache cleared.

**Symptom:** Regular (in-stock) orders showed an empty "Please note:" line item property.

**Root cause:** Customers who had pre-order items in their cart before our fix had the old `properties[Please note]` field cached in their cart session. When they checked out with new items after the fix, the cached field traveled with them.

**Not a code issue.** The `disabled` attribute on the hidden input correctly excludes it from `FormData`. The stale cache cleared on its own.

---

## Issue 5 — Stash conflict when creating branch from main

**Encountered:** During PR #14 development
**Status:** Resolved

**Symptom:** When creating a new branch from fresh main, the 193 Shopify auto-commits on main had overwritten `buy-buttons.liquid` with the upstream version, losing our changes.

**Fix:** `git stash` → `git checkout main && git pull` → `git checkout -b [branch]` → `git stash pop`. Always stash local changes before switching to main.

---

## Known Limitations

**FA metafields vs Shopify inventory:** The two systems can be out of sync. FA is the source of truth for pre-order state. Shopify's `available` field is only used for the sold-out/waitlist case. If FA metafields aren't updated by b.solutions, button state won't reflect true inventory.

**Klaviyo BIS threshold at 10,000 units:** This is intentional — it prevents automated "back in stock" emails firing when pre-order inventory arrives (which is reserved for pre-order buyers, not waitlist). The client manages waitlist notifications manually.

**No access to BrightPearl or FA:** We can't activate pre-order states on products ourselves. Testing pre-order flows requires the client or b.solutions to set `futurestock > 0` on a variant.
