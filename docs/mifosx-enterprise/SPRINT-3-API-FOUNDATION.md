# Sprint 3: Dashboard API Foundation

Branch: feature/dashboard-sprint-3-api-foundation
Base: feature/dashboard-sprint-2

## Sprint Goal

Introduce a safe API integration foundation for the dashboard without replacing the full mock dashboard yet.

## Scope

Included:

- DashboardApiService thin HTTP wrapper
- Dashboard API model types
- Facade fallback behavior
- First safe KPI API mapping seam
- API mapping documentation update
- Tests for fallback behavior

Excluded:

- Odoo
- React rewrite
- New backend endpoint
- Full dashboard real-data replacement
- Heavy chart integration

## Engineering Rule

Sprint 3 should connect only one safe slice at a time.

If real API/report mapping fails or is unavailable, the dashboard must still render using mock fallback data.

## Target Architecture

```text
DashboardComponent
  -> DashboardFacadeService
  -> DashboardApiService
  -> Fineract / MifosX endpoint or runreport
```

## First API Seam

Use DashboardApiService to support future report calls:

```text
runReport(reportName, params)
```

The facade keeps the existing ready mock view model until exact report names and parameter contracts are approved.

## Human Review Required

- Confirm first real KPI to integrate.
- Confirm report name / endpoint for portfolio total.
- Confirm required report parameters.
- Confirm currency and office/branch filtering.

## Quality Gates

```bash
npm run lint
npm run test
npm run build
```
