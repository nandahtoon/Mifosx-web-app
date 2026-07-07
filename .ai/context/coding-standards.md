# Coding Standards Context

## General

- Keep changes small and focused.
- Reuse existing code patterns.
- Avoid unrelated formatting changes.
- Avoid adding new dependencies unless approved.
- Avoid customer-specific logic.
- Do not hardcode deployment-specific values.

## Angular

- Prefer Angular Material components already used in the app.
- Keep API calls in services.
- Keep components readable and focused.
- Use observables consistently with existing code.
- Add loading, empty, and error states for user-facing UI.

## Documentation

Update docs when changing architecture, workflow, routes, risk behavior, AI behavior, or integration behavior.

## Pull Requests

Every PR should state:

- Business purpose.
- Scope.
- Files changed.
- Routes affected.
- APIs or reports used.
- Checks run.
- Known limitations.
