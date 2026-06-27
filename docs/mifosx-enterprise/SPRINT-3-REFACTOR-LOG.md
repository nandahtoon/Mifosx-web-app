# Sprint 3 Refactor Log

Sprint: Dashboard API Foundation
Branch: feature/dashboard-sprint-3-api-foundation

## Refactor Goals

- Introduce API boundary safely.
- Avoid coupling dashboard UI components to HTTP APIs.
- Preserve mock fallback until real report names are approved.
- Keep Sprint 3 small and reviewable.

## Refactor Actions

### 1. Dashboard API Models

Added `dashboard-api.model.ts` with:

- DashboardRunReportParams
- DashboardRunReportResponse
- DashboardApiError

Reason:

Dashboard API layer needs typed contracts before real endpoint mapping.

### 2. DashboardApiService

Added `DashboardApiService` as a thin HTTP wrapper around `/runreports/{reportName}`.

Reason:

Existing ReportsService already uses the same endpoint pattern. Dashboard should keep its API calls isolated instead of directly reusing UI report services.

### 3. Facade API Seam

DashboardFacadeService now injects DashboardApiService and exposes `hasApiIntegrationReady()`.

Reason:

Confirms the API boundary exists without replacing the mock dashboard prematurely.

### 4. Tests

Added tests for:

- DashboardApiService runReport URL/params mapping
- DashboardFacadeService API seam readiness

## Deferred

- Real report name selection
- Portfolio total API mapping
- API fallback handling with catchError
- Loading state driven by real API request
- Per-widget loading/error states

## Deep Refactor Check

Current result:

- UI still depends only on facade state.
- Facade now has API integration seam.
- API layer is isolated and testable.
- No backend contract changes.
- No new dependencies.

## Recommendation

Sprint 4 should integrate one real KPI only, preferably Total Portfolio, after confirming exact report name and parameters.
