# Sprint 7.2 Dashboard Reconciliation

## Goal

Reapply the intended Sprint 2 to 6 dashboard state/API/fallback foundation directly on top of current `dev`.

## Why

Sprint 7.1 audit found that inspected `dev` dashboard files still showed Sprint 1 state. This reconciliation slice makes the actual code match the intended roadmap.

## Reconciled Items

- DashboardState model
- Dashboard state template with loading, empty, error, and ready views
- Retry hook
- DashboardApiService
- DashboardReportConfigService
- Total Portfolio mapper
- Total Portfolio fallback path
- Facade tests updated for state stream
- API service tests
- Mapper tests

## Safety Rules

- Total Portfolio real report remains disabled by default.
- `reportName` remains `null` until human approval.
- Mock fallback remains active.
- No Odoo scope.
- No React rewrite.
- No backend contract change.

## Next Step

Run CI and inspect logs. If green or docs/code review approves, squash merge into `dev`.
