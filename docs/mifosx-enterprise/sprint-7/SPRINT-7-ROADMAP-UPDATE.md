# Sprint 7 Roadmap Update

## Current Status

Sprint 7.1 is an audit-only slice.

## Important Finding

The highest-priority debt is branch/release drift, not dead code.

The inspected `dev` branch does not visibly contain later dashboard state/API/fallback work in the dashboard files reviewed.

## Updated Priority

1. Reconcile Sprint 2 to 6 dashboard follow-up work against `dev`.
2. Confirm CI green after PR #7 stylelint config merge.
3. Add official workflow policy document.
4. Then start code cleanup.

## Next Small Slice

Create a reconciliation branch from `dev` that reapplies Sprint 2 to 6 changes in one controlled PR, or rebuilds them as smaller PRs:

- dashboard state model
- loading/empty/error state templates
- dashboard API service
- total portfolio config seam
- total portfolio mapper and fallback
- docs rollup

## Do Not Do Yet

- Do not start navigation reengineering.
- Do not start design system extraction.
- Do not remove services/components until branch state is stable.
