# Sprint 7.1 Technical Debt Report

Scope: repository-wide audit only. No production code change.

## Executive Summary

The immediate technical debt is not a UI bug. It is delivery-chain drift.

Several dashboard follow-up PRs were merged into stacked feature branches, but the current `dev` branch still shows only Sprint 1 dashboard state in the inspected files. This means the roadmap docs and intended implementation chain must be reconciled before more feature work.

## Findings

### TD-001: Dashboard sprint chain drift

Severity: Critical

Evidence:

- `src/app/dashboard/dashboard.component.ts` on `dev` still uses `dashboard$ = this.dashboardFacade.getDashboardViewModel()`.
- `src/app/dashboard/services/dashboard-facade.service.ts` on `dev` still exposes only `getDashboardViewModel()`.
- Sprint 2 to 6 intended state/API/fallback changes are not visible in these inspected `dev` files.

Risk:

- Future work may be built on documentation assumptions instead of actual merged code.
- AI agents may continue from the wrong branch state.
- CI and code review can pass docs while implementation remains incomplete.

Recommendation:

- Stop feature expansion until branch ancestry is reconciled.
- Create a reconciliation PR that applies Sprint 2 to 6 changes directly onto `dev`, or close obsolete stacked PRs and rebuild from current `dev`.

### TD-002: Issue tracking disabled

Severity: Medium

Evidence:

- GitHub Issues are disabled for this repository.

Risk:

- The approved workflow requires an Issue step.
- Without Issues, scope tracking may move into ad-hoc chat or PR comments.

Recommendation:

- Enable Issues in repository settings, or officially use PR comments as issue-equivalent records.

### TD-003: Stylelint configuration was missing before cleanup

Severity: High

Evidence:

- `package.json` runs `stylelint "src/**/*.scss"`.
- A stylelint config was added through PR #7.

Risk:

- CI can fail at stylelint without clear project-specific rules.

Recommendation:

- Keep `.stylelintrc.json` on `dev`.
- Run CI after merge and fix any concrete SCSS rule violations as separate small slices.

### TD-004: Sidenav menu remains dense and static

Severity: Medium

Evidence:

- `src/app/core/shell/sidenav/sidenav.component.html` contains many direct `mat-list-item` entries.

Risk:

- Harder to maintain role-aware navigation.
- Harder to implement future simplified enterprise menu groups.

Recommendation:

- Defer code change until Navigation Reengineering sprint.
- First extract a typed menu model and keep existing visual behavior.

### TD-005: Dashboard mock data remains in facade

Severity: Medium

Evidence:

- `DashboardFacadeService` contains hard-coded KPI, alert, task, recent loan, activity, PAR, trend, and product mix data.

Risk:

- Mock data can be mistaken for production data.
- Future API mapping becomes harder if mock data grows.

Recommendation:

- Restore/merge the intended Sprint 2 to 6 API/state/fallback work onto `dev`.
- Keep mock fallback explicit and clearly labeled.

## Priority Order

1. Reconcile Sprint 2 to 6 branch drift.
2. Confirm CI green on `dev` after PR #7.
3. Add workflow policy document to enforce issue/branch/PR/CI/merge pattern.
4. Start code cleanup only after actual merged code state is stable.
