# Sprint 7.1 Architecture Violations Audit

Scope: architecture audit only. No code change.

## Desired Architecture

```text
Component -> Facade -> API Service -> Mapper -> HTTP / Fineract
```

## Findings

### AV-001: Dashboard implementation does not match later roadmap state

Severity: Critical

The inspected `dev` branch dashboard still uses the Sprint 1 facade method:

```text
DashboardComponent -> DashboardFacadeService.getDashboardViewModel()
```

Expected later sprint state:

```text
DashboardComponent -> DashboardFacadeService.getDashboardState()
```

Impact:

- Loading, empty, error, retry, API service, mapper, and fallback architecture are not visible in inspected `dev` files.

Required action:

- Reconcile Sprint 2 to 6 into `dev` or rebuild those slices from current `dev`.

### AV-002: Dashboard facade owns too much mock data

Severity: Medium

The facade currently contains all dashboard section data inline.

Impact:

- The facade is doing orchestration and acting as a mock database.
- Future API mapping can become confusing.

Required action:

- Keep mock fallback data in a separate mock factory or fallback mapper.
- Keep facade orchestration-only where practical.

### AV-003: Navigation is template-heavy

Severity: Medium

The shell sidenav template directly owns many navigation entries.

Impact:

- Hard to evolve to enterprise menu groups.
- Permission rules are spread across template markup.

Required action:

- Create typed navigation model in a later sprint.
- Preserve visual behavior first; refactor structure second.

## Recommendation

Do not start broad refactors until Sprint 2 to 6 drift is reconciled against `dev`.
