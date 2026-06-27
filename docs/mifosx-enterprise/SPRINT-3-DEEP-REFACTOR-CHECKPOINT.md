# Sprint 3 Deep Refactor Checkpoint

Sprint: Dashboard API Foundation
Branch: feature/dashboard-sprint-3-api-foundation

## Principle

API integration must be introduced through a stable boundary before any dashboard widget depends on real backend data.

## Checks

### 1. API Boundary

DashboardApiService exists and owns dashboard HTTP/runreport calls.

Result: Pass.

### 2. UI Isolation

No dashboard child component calls an API.

Result: Pass.

### 3. Facade Boundary

DashboardFacadeService remains the orchestration layer.

Result: Pass.

### 4. Safe Fallback

Mock data remains active until exact report names and parameters are approved.

Result: Pass.

### 5. Testability

DashboardApiService has HTTP param mapping tests.
DashboardFacadeService has API seam readiness tests.

Result: Initial pass, pending local CI.

## Known Technical Debt

- `hasApiIntegrationReady()` is a temporary seam check.
- Real API mapping is not active yet.
- Report response mappers are not implemented yet.
- Error fallback with catchError is deferred to Sprint 4.

## Decision

Sprint 3 is complete as an API foundation sprint.

Do not connect multiple KPIs at once in Sprint 4.

Recommended next sprint:

- connect Total Portfolio only
- add mapper for one report response shape
- add catchError fallback
- keep other KPI data mocked
