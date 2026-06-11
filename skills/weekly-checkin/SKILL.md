---
name: weekly-checkin
description: >-
  Reconstruct what Francisco worked on each day for a Koombea weekly timesheet
  (checkin), per project and per ticket, by cross-referencing git commits,
  GitHub PRs, and Jira ticket history. Fire when the user says "weekly checkin",
  "timesheet", "qué ticket trabajé", "armá el checkin", "fill my timesheet",
  references a timesheet screenshot, or asks which ticket/task to log against
  each day. Produces a per-day / per-ticket breakdown matching hours already
  entered. Does NOT submit the timesheet — it only tells the user what to enter.
---

# Weekly Checkin (Koombea timesheet helper)

Reconstruct, for a given week, **which ticket the user worked on each day in each
project**, by triangulating three sources of truth:

1. **git commits** — authored by the user, in the project's local repo
2. **GitHub PRs** — created / merged dates, review cycles (`gh`)
3. **Jira ticket history** — status transitions (To Do → In Progress → QA →
   Done), QA feedback comments, and ticket summaries (`jira` and/or `acli`)
4. *(optional)* **Slack context** the user pastes (handoffs, billable-hour
   confirmations, scope) — use it to fill gaps the commits don't show.

The deliverable is a markdown table per project: `Day | Hours | Ticket | What you
did (evidence)`. **Never submit or edit the timesheet** — the user enters it
manually. Hours are usually already entered; your job is the *what*, made to fit
those hours.

## Inputs to gather first

Ask the user (or read from a pasted timesheet screenshot) for:

- **Week range** (e.g. `2026-06-05` to `2026-06-11`) and which weekdays have hours.
- **Project → repo mapping** and **hours per day per project**. If the user
  pasted a timesheet image, read the project rows, the Task column, and the per-day
  hours directly from it.

Check `references/projects.md` first — it holds Francisco's known project→repo
mapping and Task labels. Update that file when a new project appears or a path
changes.

## Procedure

### 1. Verify tooling and identity

```bash
git config --global user.email          # commits are matched on this
which gh && gh auth status | head -3
which jira; which acli
```

Match commits on **both** the user's name and git email (the work email and the
personal `fbeccaria24@gmail.com` may differ from the Koombea SSO identity). Use a
permissive author filter: `--author="Beccaria\|fbeccaria24\|francisco"`.

### 2. Pull commits per repo (the backbone)

For each project repo, in the week window — **`--all`** so feature branches not yet
merged are included:

```bash
cd <repo>
git log --all --since="<start> 00:00" --until="<end> 23:59" \
  --author="Beccaria\|fbeccaria24\|francisco" \
  --pretty=format:"%ad | %s" --date=format:"%a %m-%d %H:%M"
```

Also dump *all* authors in the window (`head -40`) for context — merges by
teammates, Shopify bot noise (Mina Baie), etc. Ticket keys live in commit
subjects: `AIR-544`, `[TDB-708]`, etc. Extract them.

### 3. Pull PRs (created / merged / review cycles)

```bash
gh pr list --author "@me" --state all --limit 15 \
  --json number,title,createdAt,mergedAt,state
```

`createdAt` ≈ when work was "ready for review/QA". `mergedAt` ≈ when it closed.
A PR open across several days with review commits = ongoing work on that ticket.

### 4. Pull Jira history per ticket key

```bash
jira issue view <KEY> --plain                 # summary + current status + dates
jira issue view <KEY> --comments 10 --plain   # QA feedback, handoff comments
```

What to extract:
- **Status now** (En curso / Control de calidad·QA / Finalizada) → tells you if a
  ticket was still in progress at week's end (assign continuation days to it).
- **QA round-trips**: a "ready for QA" comment, then a QA-engineer comment with
  feedback, then a fix → this is the classic `dev → QA → feedback → fix → merge`
  arc. Map each leg to the day its commit/comment landed.

### 5. Reconcile commits → days → hours

- A day with hours but **no commit** (common at week's end, or Mina-Baie-style
  work split across two days but billed on one) → assign it to the **ticket still
  in progress** on that day (the branch the user is currently on:
  `git branch --show-current`), and say so explicitly as an assumption.
- Work split across days but billed on one day → honor the billed day; note the
  real work spanned both.
- Tickets without Jira (e.g. Mina Baie themes) → reference the **PR number**
  instead of a Jira key.

### 6. Output

One table per project, plus a short **"things to confirm"** list for every
inference you made (days with no commit, split-day billing, assumed
continuations). Totals must equal the hours already entered. Do **not** call any
submit tool — end by asking if they want adjustments or to save a template.

## Known gotchas

- **Mina Baie**: repo is *outside* `~/development` (`~/Mina-Baie-Theme`); no Jira
  — use GitHub PRs. `shopify[bot]` commits are auto-syncs, ignore them.
- **Thu/Fri end-of-week** often has hours but the commit is the prior day — the
  ticket is still open; assign continuation, flag it.
- Match on git email, not just name — identities can differ across repos.
- Billable feature scope sometimes lives only in Slack (e.g. "request billable,
  8 horas, network check"). If the user pastes Slack, mine it for hour budgets
  and who requested the work.

See `references/projects.md` for the current project→repo→Task map.
