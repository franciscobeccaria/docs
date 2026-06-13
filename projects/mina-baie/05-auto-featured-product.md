# Auto Featured Product — Every 3rd in Collection

**Requested by:** Pedro Sa Freire (Mina Baie client)
**Analysis date:** 2026-04-17
**Status:** Under estimation / pending client approval
**Developer:** Francisco Beccaria (Koombea)

---

## Context & client pain

A previous developer implemented a "featured product" system in the collection grid — a product that appears larger (2x2 in the grid) for an editorial visual effect.

The problem: to control which product is featured in each collection, you need to create a **specific collection template** (e.g. `collection.new-arrivals.json`), open Shopify's visual editor, manually add a block indicating the product and its position, and assign that template to the collection.

This doesn't scale. Today there are 12+ templates with this pattern in the repo:

```
collection.feature.json
collection.harlow-feature.json
collection.most-loved.json
collection.sale.json
collection.stevie-feature.json
collection.stevie-test.json
collection.coming-soon-countdown.json
collection.join-the-waitlist.json
collection.mina-collective-sienna.json
collection.mina-collective.json
collection.bestsellers-featured.json
collection.collection-featured.json
```

Changing which product is featured requires editing the block manually in the theme editor. You can't do it simply by reordering products from Shopify admin.

---

## What the client wants

### For the website visitor (end customer)

When browsing any collection, the grid doesn't show all cards the same size. Every third product appears larger, visually highlighting that item. The order of products in the collection determines which gets featured: the 3rd, 6th, 9th, etc.

### For the Mina Baie team (Shopify admin)

Control over the featured product moves to **the order of products within the collection** — something they already manage today by dragging products in admin. No need to create new templates, no entering the theme editor, no additional configuration.

---

## Current system (technical)

The theme has two product highlight mechanisms:

**1. Metafield per product (`custom.highlight_card`)**

* If a product has this metafield set to `true`, it displays as a featured card
* Requires setting the metafield product by product

**2. Blocks in the collection editor**

* The `main-collection.liquid` section supports blocks of type `product` with `position` (1–50) and `size` (1_1, 2_1, 2_2) settings
* The block is inserted at the indicated grid position
* CSS handles card expansion via `.product-card--highlight` → `grid-area: span 2 / span 2`
* This is the system the previous developer used — and the one causing the scalability problem

**Key files:**

* `snippets/product-list.liquid` — main loop over `collection.products`, has `locksmith_29c7_forloop__index` variable for current position
* `snippets/product-card.liquid` — highlight detection logic (lines 49–52), CSS class assignment
* `assets/theme.css` — `.product-card--highlight` and `.product-list__promo` classes with grid styles

---

## Proposed solution: Auto every 3rd by position

The simplest option aligned with what the client asked for. Automatic logic based on the product's position in the loop: if `position % 3 == 0`, it gets featured.

### Alternatives evaluated and discarded

| Alternative | Why discarded |
| -- | -- |
| Metafield per collection (on/off + interval) | More complex; requires configuring each collection up front |
| Tag on product (`featured-card`) | Doesn't guarantee consistent visual rhythm; two featured could end up adjacent |
| Auto + override by tag | More flexible but larger bug surface; unnecessary for what the client requested |
| Keep blocks system | That's exactly the problem they want to solve |

### Technical implementation

**Changes in `snippets/product-list.liquid`:**

```liquid
{%- assign pos_mod = locksmith_29c7_forloop__index | modulo: 3 -%}
{%- assign auto_highlight = false -%}
{%- if pos_mod == 0 -%}{%- assign auto_highlight = true -%}{%- endif -%}
{%- render 'product-card', ..., force_highlight: auto_highlight, allow_highlight: true -%}
```

**Changes in `snippets/product-card.liquid`:**

```liquid
if (allow_highlight and product.metafields.custom.highlight_card.value) or force_highlight
  assign highlight_card = true
endif
```

CSS already exists and requires no changes.

---

## Estimate

| Phase | Time |
| -- | -- |
| Development (2 files) | 2–3 hours |
| QA (see checklist below) | 3–4 hours |
| **Total** | **5–7 hours** |

Quote with 8 hours as a safe margin.

---

## Work plan

1. Create branch `feat/auto-featured-every-third` from `main`
2. Implement changes in `product-list.liquid` and `product-card.liquid`
3. Generate theme zip and upload as dev theme in Shopify admin
4. Full QA (see checklist)
5. PR to `main` with behavior description
6. Deploy to live theme

---

## QA Checklist

| Case | Suggested collection | What to verify |
| -- | -- | -- |
| Base case | `/collections/new-arrivals` | 3rd, 6th, 9th are visually featured |
| With active filters | Any with filters | The 3rd of filtered products is featured |
| Pagination — page 2 | Collection with 8+ products | Define behavior (see open items) |
| Collection with few products (1–2) | To confirm | Layout doesn't break with no featured |
| Collection with exactly 3 products | To confirm | The last one is featured — verify it looks right |
| Mobile 2 columns | New arrivals on mobile | Featured takes full width |
| Mobile 3 columns | New arrivals on mobile | CSS disables highlight — confirm it looks right |
| Collections with existing blocks | `collection.feature.json` | Both systems don't conflict |
| Desktop | New arrivals on desktop | 2x2 in the grid, correct layout |

---

## Open items

### To confirm with client before starting

**What happens with existing templates?**
The 12+ templates with manual blocks are exactly the system they want to replace. Options:

* **A)** Full migration: remove blocks from all existing templates and let the auto-system take over
* **B)** Coexistence: auto-system applies to collections without a special template; old templates keep their behavior

Recommendation: option A, but needs client confirmation.

### Implementation details to decide internally

**Pagination — global or per-page position?**

* Per-page: the 3rd product on each page is featured (simpler to implement)
* Global: the 3rd, 6th, 9th counting from product #1 of the collection (requires using `paginate.current_offset`)
* Recommendation: per-page position — more visually predictable and simpler
