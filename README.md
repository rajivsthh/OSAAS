Apricity

Apricity is a lightweight frontend for running, viewing, and managing security scans. It provides an interactive interface to upload code, run the built-in `Scanner`, inspect findings, and review historical reports. The project is designed for quick local triage with an emphasis on ephemeral, secure analysis and easy integration into CI or alerting workflows.

Key points:
- Run scans and view detailed findings
- Historical reports and dashboards for trend analysis
- Integrations for notifications and webhooks

For development, use the existing npm scripts (e.g., `npm run dev`).

Idea: Scheduled Scanner — Findings Timeline & Webhook Alerts

- What: a scheduler that runs the existing `Scanner` on a configurable cadence, persists scan runs and findings, and exposes a timeline UI in `Reports`. It also supports webhook notifications for new or high-severity findings.

- Why: automated recurring scans catch regressions, centralize historical context, and enable automated alerts to teams or services.

How it works (high level)

1. Scheduler: cron-style service or serverless trigger enqueues scan jobs on schedule.
2. Scanner runner: runs the existing `Scanner` against provided inputs (repo, uploaded files, or artifact) and produces a findings payload (JSON).
3. Storage: save `scan_runs` (metadata) and `findings` (JSON blobs) in a lightweight store (SQLite for MVP, Postgres later).
4. Diffing & deduplication: identify new, resolved, or unchanged findings between runs to surface regressions.
5. Reports UI: a timeline view in the `Reports` page showing runs, severity trends, and quick comparison between runs.
6. Notifier: webhook worker posts alerts for configured endpoints (with rate limits and retry/backoff).

Minimum viable implementation steps

1. Add data schema (local SQLite or JSON files) for `scan_runs` and `findings`.
2. Implement a simple scheduler (Node `cron` or OS cron) that calls the `Scanner` and stores results.
3. Build a tiny timeline UI in `src/pages/Reports.tsx` that queries stored runs and shows deltas.
4. Add webhook configuration and a small worker to POST alerts for new/high-severity findings.

Notes

- Start with local persistence for rapid iteration; migrate to a shared DB for multi-user setups.
- Secure any stored artifacts; scan outputs may contain sensitive data.
- Rate-limit and authenticate outbound webhooks.

Run locally

```bash
npm install
npm run dev
```

If you want, I can commit and push this updated `README.md`.