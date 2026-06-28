# Shell UI Modernization Audit

## Purpose

Prepare the next MicroOps 360 UI modernization phase for the authenticated application shell without changing runtime behavior in this PR.

## Verified Shell Composition

| Area | Verified path | Notes |
| --- | --- | --- |
| Shell container | `src/app/core/shell/shell.component.html` | Hosts sidenav, toolbar, breadcrumb, content, footer, and optional copilot host. |
| Sidenav | `src/app/core/shell/sidenav/sidenav.component.html` | Holds app brand, user panel, frequently accessed actions, and main navigation items. |
| Toolbar | `src/app/core/shell/toolbar/toolbar.component.html` | Holds top navigation tabs, search, language selector, notifications, theme toggle, and user menu trigger. |

## Current Observations

- The shell container composes the main authenticated layout with `mat-sidenav-container`, `mifosx-sidenav`, `mifosx-toolbar`, breadcrumb, content, and footer.
- The sidenav still displays `APP_NAME` through translation and references the existing `assets/images/MifosX_logo.png` logo path.
- The toolbar is functional but dense: navigation tabs, search, language, notifications, theme, and user menu share one horizontal row.
- Footer path was not confirmed by targeted fetch and should be located before any footer patch.

## Modernization Guardrails

1. Do not rename Angular selectors such as `mifosx-sidenav`, `mifosx-toolbar`, or `mifosx-footer` in UI modernization slices.
2. Do not rename routes, permissions, environment variables, or API identifiers.
3. Do not replace logo assets until a reviewed MicroOps 360 asset exists.
4. Patch one visible UI area per PR.
5. Keep shell changes reversible and covered by build and E2E checks.

## Recommended Next PR

Patch the sidenav visible app brand text from translated `APP_NAME` to `MicroOps 360 Web` while leaving the icon asset path and Angular selectors unchanged.
