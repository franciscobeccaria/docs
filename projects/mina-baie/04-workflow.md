## Branch Naming

Follow the existing convention from Francisco's PRs:

```
fix/[short-description-kebab-case]
```

Examples from this project:

* `fix/waitlist-fa-integration`
* `fix/remove-please-note-prefix`
* `fix/waitlist-klaviyo-visibility`

Note: Mark (other active developer) uses `mark/[description]`. His branches are unrelated to our work — don't merge or rebase on them.

---

## Commit Convention

```
fix: [short present-tense description]
```

Keep it one line. Describe what it does, not what file changed.

---

## PR Description Structure

Follow this format (from PR #9 and #14):

```markdown
## Summary
- Bullet points describing what changed and why

## Files changed
- `path/to/file.liquid` — what changed in this file

## Testing
- Bullet list of test cases verified on dev theme
```

---

## Dev Theme Zip Process

Generate a zip for QA testing without committing to production:

```bash
cd /Users/francisco.beccaria
zip -r Mina-Baie-Theme-dev.zip Mina-Baie-Theme/ \
  --exclude "*.git*" \
  --exclude "*node_modules*" \
  --exclude "*.DS_Store*" \
  --exclude "*docs/*"
```

The zip goes to `/Users/francisco.beccaria/Mina-Baie-Theme-dev.zip`. Upload it in Shopify admin → Online Store → Themes → Add theme → Upload zip. Do **not** publish it — keep it as a preview theme for QA.

---

## Full Deploy Flow

```
1. Make changes on feature branch
2. Generate zip → upload as dev theme → QA tests
3. QA approves → push branch → open PR → merge to main
4. Verify Shopify auto-synced (check live theme has the change)
5. If sync didn't fire → Shopify admin → "Reset to latest commit"
```

---

## Shopify ↔ GitHub Sync

The repo is connected to Shopify's GitHub integration (bidirectional):

* **Theme editor saves** → auto-commit to `main` (commit message: "Update from Shopify for theme Mina-Baie-Theme/main")
* **PR merged to main** → Shopify pulls and deploys automatically

**Known issue:** The sync service can silently drop events. After every merge, check the live theme. If it didn't update, go to:

> Shopify Admin → Online Store → Themes → (connected theme) → ... → Reset to latest commit

This re-pulls GitHub HEAD without disconnecting the integration. It's safe and doesn't affect anything else.

---

## QA Checklist

For any change affecting button logic, test all three states **without adblocker** (so Klaviyo loads):

| State | Expected |
| -- | -- |
| In stock variant | "Add to Bag" only, no waitlist visible |
| Sold out variant | "Join the Waitlist" only, ATC hidden |
| Pre-order variant | "Pre Order" only, no waitlist visible |
| Switch sold-out → in-stock | ATC appears, waitlist disappears |
| Switch in-stock → sold-out | Waitlist appears, ATC disappears |
| Cart qty reaches onhandstock | Switches from "Add to Bag" to "Pre Order" |

Test product: **Sienna Vegan Full** has sold-out variants. For pre-order state, coordinate with Pedro or b.solutions to set `futurestock > 0` on a test variant.

---

## Notes on Shopify Auto-Commits

The `main` branch receives frequent auto-commits from the Shopify theme editor (client's team making changes through the UI). Before starting any new work:

```bash
git checkout main && git pull
git checkout -b fix/[your-branch]
```

If you already have local changes, stash first:

```bash
git stash
git checkout main && git pull
git checkout -b fix/[your-branch]
git stash pop
```
