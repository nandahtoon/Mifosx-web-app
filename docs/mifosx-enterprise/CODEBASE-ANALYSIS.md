# Codebase Analysis for MifosX Dashboard Modernization

Date: 2026-06-27
Branch: feature/dashboard-modernization

## 1. Repository and Branch

Target repository:

- nandahtoon/Mifosx-web-app

Default branch:

- dev

Working branch:

- feature/dashboard-modernization

## 2. Package / Stack Findings

From package.json and angular.json:

- Application name: mifosx-web-app
- Angular: 20.3.x
- Angular Material/CDK: 20.x
- TypeScript: 5.9.x
- RxJS: 7.8.x
- Chart.js: already installed
- D3: already installed
- Jest: configured for unit tests
- Playwright: configured for e2e
- SCSS is the component style standard
- App source root is src
- Main global style is src/main.scss
- Theme bundle is src/theme/mifosx-theme.scss

Decision:

Do not add a new chart library or UI framework in Sprint 1. Use existing Angular Material, SCSS, Chart.js/D3 later only when needed.

## 3. Routing Pattern

The top-level app routing uses lazy-loaded feature modules in src/app/app-routing.module.ts.

Feature modules do not directly render plain routes only. Existing feature route modules use:

- Route.withShell([...])

Route.withShell wraps feature pages with:

- ShellComponent
- AuthenticationGuard

Decision:

Dashboard routing must use Route.withShell to preserve authenticated shell layout, sidebar/topbar behavior, and consistency with existing modules.

## 4. Module and Component Pattern

Existing modules such as ClientsModule and TasksModule use Angular NgModule imports with standalone components inside imports.

Pattern:

- feature.module.ts imports SharedModule, RoutingModule, PipesModule, DirectivesModule if needed
- standalone components are imported in the NgModule imports array
- components use ChangeDetectionStrategy.OnPush
- components import STANDALONE_SHARED_IMPORTS when standalone

Decision:

Dashboard should follow the same hybrid pattern:

- dashboard.module.ts
- dashboard-routing.module.ts
- standalone DashboardComponent
- OnPush change detection
- STANDALONE_SHARED_IMPORTS

## 5. Service / API Pattern

Existing services are root-provided Angular services using HttpClient.

Examples:

- ClientsService calls endpoints such as /clients and /runreports/ClientSummary
- ReportsService wraps /reports and /runreports endpoints

Pattern:

- inject(HttpClient)
- use HttpParams for query params
- return Observable<any> or mapped model objects
- keep endpoint paths relative for existing interceptors/proxy

Decision:

Dashboard real-data integration should be split into:

- DashboardApiService: thin HTTP wrapper
- DashboardFacadeService: orchestration and mapping
- Dashboard mapper/model files: typed UI view models

Do not put HTTP calls or business mapping inside DashboardComponent.

## 6. Current Dashboard Gap

No dedicated top-level dashboard route was found in app-routing.module.ts.

Decision:

Dashboard should be introduced as an isolated feature module and registered as a lazy-loaded route after human approval.

Manual route decision required:

- Option A: empty path redirects to dashboard
- Option B: dashboard is exposed by navigation only

## 7. Existing Quality Tooling

package.json provides:

- npm run lint
- npm run test
- npm run test:ci
- npm run build
- npm run build:prod
- npm run playwright

Decision:

Every dashboard PR should pass at minimum:

- npm run lint
- npm run test
- npm run build

## 8. Sprint 1 Correction Applied

Initial dashboard routing was plain child route only.

Corrected to Route.withShell in dashboard-routing.module.ts.

## 9. Next Engineering Steps

Before more visual work:

1. Confirm route registration strategy.
2. Add typed dashboard models.
3. Split large DashboardComponent mock data into facade service.
4. Split reusable UI pieces:
   - KPI card
   - Dashboard panel
   - Alert card
   - Task card
   - Recent loans table
5. Add unit tests for mapping/facade when real data starts.

## 10. Guardrails

- No React.
- No Odoo.
- No unrelated modules.
- No new API contract without approval.
- No production hard-coded data after API integration stage.
- Mock data must stay isolated and removable.
