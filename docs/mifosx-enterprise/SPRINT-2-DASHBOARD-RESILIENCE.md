# Sprint 2: Dashboard Resilience and Navigation

Branch: feature/dashboard-sprint-2
Base: feature/dashboard-modernization

## Sprint Goal

Make the dashboard reviewable and operationally safe by adding loading, empty, error, and navigation readiness before real API integration.

## Scope

Included:

- Dashboard state model
- Loading state shell
- Empty state shell
- Error state shell
- Retry action placeholder
- Navigation/menu integration analysis
- Dashboard route UX polish
- Documentation and refactor log

Excluded:

- Odoo
- React rewrite
- Real Fineract API integration
- New chart dependency
- Default dashboard redirect unless approved

## Engineering Strategy

Sprint 1 created the dashboard visual foundation.

Sprint 2 must make it resilient:

```text
DashboardFacadeService
  -> DashboardState
  -> DashboardComponent
  -> loading / empty / error / ready views
```

## Human Review Gates

| Gate | Review Item | Decision |
|---|---|---|
| H1 | Loading/empty/error UX | approve / revise |
| H2 | Navigation/menu strategy | approve / revise |
| H3 | Retry behavior placeholder | approve / revise |
| H4 | Sprint 2 deep refactor | approve / revise |

## First Implementation Tasks

1. Add `DashboardState` model.
2. Replace raw `DashboardViewModel` observable with state observable.
3. Add dashboard loading template.
4. Add dashboard empty template.
5. Add dashboard error template.
6. Add tests for state contract.
7. Document navigation decision.

## Quality Gates

Run locally/CI:

```bash
npm run lint
npm run test
npm run build
```
