# Dashboard Navigation Analysis

Sprint: 2
Branch: feature/dashboard-sprint-2

## Finding

The shell sidenav already contains a Dashboard navigation item that routes to:

```text
/dashboard
```

Location:

```text
src/app/core/shell/sidenav/sidenav.component.html
```

The item appears under Main Items and uses:

- routerLink `/dashboard`
- routerLinkActive `active-menu`
- dashboard tooltip key
- dashboard label key

## Sprint 2 Decision

Do not add a second dashboard menu item.

Reason:

- Existing dashboard menu item is already present.
- Duplicate menu entries would reduce UX clarity.
- Sprint 2 should preserve shell navigation behavior.

## Current Integration State

- `/dashboard` top-level route is registered.
- Dashboard feature route uses `Route.withShell`.
- Sidenav already links to `/dashboard`.

## Follow-up Checks

Before release, verify:

1. Translation key `labels.menus.Dashboard` exists in all supported translation files.
2. Translation key `tooltips.Dashboard` exists in all supported translation files.
3. Active menu highlighting works for dashboard route.
4. Dashboard menu visibility is acceptable for all authenticated users.

## Sprint 3 Candidate

If product owner wants role-based dashboard visibility, add permission-aware display later.

Do not add that in Sprint 2 unless explicitly approved.
