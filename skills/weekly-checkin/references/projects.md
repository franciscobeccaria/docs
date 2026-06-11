# Project → Repo → Timesheet map

Keep this current. When a new project/repo appears, or a timesheet row label
changes, update this file. Repos under `~/development/` unless noted.

| Timesheet row (Client : Project) | Task column | Repo (local) | Ticket system | Ticket prefix |
|----------------------------------|-------------|--------------|---------------|---------------|
| Aires : Aires: RFP (SOW001)      | 51 — CR011 Mobile development | `~/development/mobile-app` | Jira | `AIR-` |
| TD Bank N.A. : TD Bank N.A. SOW003 | 11 — Front-end Development | `~/development/td-bank-app-web` | Jira | `TDB-` |
| MINA BAIE : Mina Baie: Rescue Project (SOW001) | 2 — Web Development | `~/Mina-Baie-Theme` *(outside development/)* | GitHub PRs only (no Jira) | — |

## Identity
- git email used in commits: `fbeccaria24@gmail.com`
- Author match filter: `--author="Beccaria\|fbeccaria24\|francisco"`

## Per-project notes
- **Aires (mobile-app)**: teammate Erika González also commits here; filter to own
  author. Mario Tatis / Mayo = PM-side requests (often in Slack `aires-internal`).
  Juan José De los santos / Juanjo = QA. Billable feature scope sometimes only in
  Slack (e.g. AIR-544 network check = 8h billable, confirmed by Mario).
- **TD Bank (td-bank-app-web)**: multiple sibling repos exist
  (`td-bank-app-web-pr471`, `td-bank-ca-app-web`, `tdbank-automation`) — the main
  one is `td-bank-app-web`. Reviewers: Rhonalf Martinez (human), Copilot. QA: Juan
  De los santos. Merges go to `origin/stg`.
- **Mina Baie**: `shopify[bot]` auto-sync commits dominate the log — ignore them.
  No Jira; reference the GitHub PR number in the checkin. Work may span two days
  but be billed on one.

## Other Koombea repos seen locally (not usual checkin projects)
cineco / cineco-backend / cineco-frontend (CineCo sandbox), mvpizer-koombea,
koombea-ai-sdlc. Add a row above only if they start appearing on the timesheet.
