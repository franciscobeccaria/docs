## Background

Mina Baie is a fashion/accessories brand running on Shopify. In January 2026 they integrated **BrightPearl** (ERP) with Shopify to manage pre-orders using a custom service called **Forward Allocation (FA)**, built by a third party (b.solutions).

A b.solutions developer added pre-order JavaScript directly to a Shopify theme (`main_preorder`) without going through GitHub. That code broke the existing Klaviyo "Join the Waitlist" feature that was already working on the live store.

Their previous developer (Mark) reverted the FA changes from production to restore the waitlist. That left two themes:

* **Live theme:** waitlist works, pre-order does NOT
* `main_preorder` theme (unpublished): pre-order works, waitlist is BROKEN

**We were hired to merge both features so they coexist correctly.**

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Shopify   │     │   Klaviyo    │     │   BrightPearl   │
│   (Store)   │◄───►│  (Marketing) │     │   (ERP)         │
│             │     │              │     │                  │
│ • Theme/UI  │     │ • BIS subs   │     │ • Inventory     │
│ • Inventory │     │ • Flows      │     │ • Pre-orders    │
│ • Orders    │     │ • Emails     │     │ • Fulfillment   │
└──────┬──────┘     └──────────────┘     └────────┬────────┘
       │                                          │
       │        ┌──────────────────┐              │
       └───────►│ Forward Alloc.   │◄─────────────┘
                │ (external svc)   │
                │                  │
                │ • Metafields:    │
                │   futurestock    │
                │   onhandstock    │
                │   earliestpodate │
                └──────────────────┘
```

**Important:** BrightPearl and Forward Allocation are NOT Shopify apps. They're external services that connect via API. They don't appear in Shopify admin and we have no direct access to them.

---

## FA Metafields

Forward Allocation writes these metafields on each Shopify variant:

| Metafield | Type | Meaning |
| -- | -- | -- |
| `custom.futurestock` | number | Units on purchase order (incoming) |
| `custom.onhandstock` | number | Units physically available now |
| `custom.earliestpodate` | date | Estimated ship date for pre-order |

These are the source of truth for button state logic — NOT Shopify's native inventory count.

---

## Variant State Logic

| State | Condition | Button |
| -- | -- | -- |
| Pre-Order | `futurestock > 0` AND (`onhandstock <= 0` OR cart qty >= onhandstock) | "Pre Order" + estimated date |
| In Stock | `shopifyAvailable: true` AND above not met | "Add to Bag" |
| Sold Out | `shopifyAvailable: false` AND no futurestock | "Join the Waitlist" |

The logic lives in `snippets/buy-buttons.liquid` — both in Liquid (server-side initial render) and in a `<script>` block (client-side variant switching and cart-aware updates).

---

## Klaviyo BIS Setup

* Script loaded in `layout/theme.liquid` line 332: `onsite.js`
* Initialized at line 339: `klaviyo.enable("backinstock", {...})`
* Configured with `product_page_class: "product-form__buttons"` and `replace_anchor: false`
* Klaviyo BIS threshold: 10,000 units (intentional — prevents false "back in stock" emails when pre-order inventory arrives)
* No automated flow exists. The client manages waitlist notifications manually via Klaviyo campaigns.
* Subscriptions are captured correctly and stored in Klaviyo with variant ID, product name, and SKU.

---

## Key Files

| File | Purpose |
| -- | -- |
| `snippets/buy-buttons.liquid` | All button logic: ATC, pre-order, waitlist. Server-side Liquid + client-side JS. |
| `snippets/product-sticky-add-to-cart.liquid` | Mobile sticky CTA — mirrors buy-buttons state for pre-order/waitlist |
| `layout/theme.liquid` | Klaviyo BIS initialization (lines 331–365) |
| `assets/custom-events.js` | GA4 tracking events (added by client's team, not our work) |

---

## Contacts

| Name | Role |
| -- | -- |
| Pedro Sa Freire | Client — Mina Baie |
| Juan Ma / Juan Jose | Internal QA (Koombea) |
| Mark | Previous Mina Baie developer (has active PRs with `mark/*` branches) |
| Francisco Beccaria | Koombea developer (us) |
