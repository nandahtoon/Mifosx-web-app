# Dashboard API Mapping Plan

Sprint: 1
Scope: MifosX Web App dashboard modernization

## Purpose

This document records how mock dashboard data should be replaced by real Apache Fineract / MifosX data after visual approval.

No API contract changes are introduced in Sprint 1.

## Current Sprint 1 State

Dashboard data is intentionally isolated in:

- `DashboardFacadeService`
- `DashboardViewModel`

UI components receive typed inputs only. Components do not call HTTP APIs directly.

## Future Data Layers

Recommended layering:

```text
DashboardComponent
  -> DashboardFacadeService
  -> DashboardApiService
  -> Existing Fineract HTTP endpoints / runreports
```

## Candidate Data Sources

| Dashboard Section | Candidate Source | Notes |
|---|---|---|
| Total Portfolio | runreports / portfolio report | Prefer existing report if available |
| Active Loans | loans endpoint or report | Needs paging-safe aggregation |
| Collections Today | transactions / collection report | Filter by business date |
| PAR over 30 days | aging / arrears report | Must match accounting/risk definition |
| Pending Approvals | checker inbox / tasks endpoints | Reuse maker-checker flow |
| Cash Balance | accounting / cash report | Only show if reliable and permissioned |
| Recent Loans | loans search/report | Start with limited recent list |
| Product Mix | product-level portfolio report | Avoid client-side full portfolio scan |
| Portfolio Trend | report snapshot / time series | Prefer report output, not heavy live query |

## Implementation Rules

- Do not call APIs from templates.
- Do not call APIs from child card components.
- Keep API calls in `DashboardApiService` only.
- Keep mapping and fallback logic in `DashboardFacadeService`.
- Keep loading, empty, and error states per panel.
- One failed panel must not break the full dashboard.
- Respect permissions before showing sensitive financial totals.
- Do not hard-code production data.

## Human Approval Needed Before Real API Work

1. Confirm dashboard KPIs.
2. Confirm report names/endpoints available in target Fineract/MifosX deployment.
3. Confirm PAR definition.
4. Confirm currency format.
5. Confirm branch/office filtering behavior.
6. Confirm whether dashboard is global, branch-level, or user-level by role.

## Sprint 2 Readiness

Only after this approval should Sprint 2 introduce:

- DashboardApiService
- dashboard loading state
- dashboard error state
- report endpoint mapping
- unit tests for mapper behavior
