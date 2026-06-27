# Sprint 4: Total Portfolio KPI and CI Automation

Branch: feature/dashboard-sprint-4-total-portfolio
Base: feature/dashboard-sprint-3-api-foundation

## Sprint Goal

Add automated command execution through GitHub Actions and prepare the Total Portfolio KPI for real report integration with safe fallback behavior.

## Added

- GitHub Actions CI workflow
- Dashboard report config model
- DashboardReportConfigService
- Total Portfolio KPI report configuration seam
- Facade fallback behavior when no report is configured
- Tests for default fallback state

## CI Commands

The CI workflow runs automatically on pull requests and feature/dev branch pushes:

```bash
npm ci
npm run lint
npm run test:ci
npm run build
```

## Total Portfolio Strategy

`DashboardReportConfigService` controls whether the Total Portfolio KPI is backed by a real report.

Default state:

```text
reportName: null
```

This means the dashboard keeps using safe mock data until a human approves the exact Fineract/MifosX report name and parameters.

## Human Approval Required

Before enabling the real report:

- confirm report name
- confirm office/branch parameter behavior
- confirm currency behavior
- confirm date range behavior
- confirm response shape

## Deferred

- Real report call activation
- mapper from report response to KPI value
- catchError fallback from failed report calls
- panel-level failure state
