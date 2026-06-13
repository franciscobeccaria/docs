# Mina Baie Theme — Documentation Index

**Project:** Klaviyo Waitlist Integration + Pre-Order Validation
**Client:** Mina Baie
**Developer:** Francisco Beccaria (Koombea)
**Repo:** [Mina-Baie/Mina-Baie-Theme](https://github.com/Mina-Baie/Mina-Baie-Theme)

---

## Documents

| Doc | What's in it |
| -- | -- |
| [01 — Project Context](01-project-context.md) | Architecture, services, what we were hired to do, client contacts |
| [02 — Implementation Log](02-implementation-log.md) | All PRs delivered, what each one changed, key technical decisions |
| [03 — Known Issues & Fixes](03-known-issues-and-fixes.md) | Bugs found, root causes, and how each was fixed |
| [04 — Workflow](04-workflow.md) | Branch naming, commit conventions, zip process, deploy & sync |
| [05 — Auto Featured Product](05-auto-featured-product.md) | Auto featured every 3rd product — analysis, solution, estimate, open items |
| [06 — PR #18 Final Status](06-pr-18-final-status.md) | Waitlist fix iterations 1–4 + Easy Bundle Builder finding (out of scope) |
| [07 — Project Status 2026-04-21](07-project-status-snapshot.md) | Global snapshot: PR #18, Easy Bundle Builder, Auto Featured Product (all 3 fronts) |

---

## Quick Reference

**Main file for all button logic:** `snippets/buy-buttons.liquid`
**Klaviyo BIS config:** `layout/theme.liquid` lines 331–365
**Mobile sticky CTA:** `snippets/product-sticky-add-to-cart.liquid`

**Three variant states:**

* In Stock → "Add to Bag" (FA: `onhandstock > 0`, cart qty < onhandstock)
* Pre-Order → "Pre Order" (FA: `futurestock > 0` AND `onhandstock <= 0`, or cart qty >= onhandstock)
* Sold Out → "Join the Waitlist" (Shopify `available: false`, no futurestock)

**PRs delivered:**

* PR #9 — Core integration (FA + Klaviyo coexistence)
* PR #14 — Remove "Please note:" prefix from pre-order line item
* PR #18 — Fix Klaviyo overriding waitlist button visibility (in QA)
