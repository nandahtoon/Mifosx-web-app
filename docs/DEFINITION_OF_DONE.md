# Definition of Done

A change is done only when all applicable criteria are met.

## Business

- Business problem is clear.
- Acceptance criteria are met.
- Out-of-scope items are not added silently.
- Change is reusable and not customer-specific.

## Fineract Compatibility

- Apache Fineract API behavior is preserved.
- Tenant header behavior is preserved.
- Authentication behavior is preserved.
- Permissions are respected.
- Client, loan, savings, group, accounting, reports, and maker-checker flows are not broken.

## Architecture

- Existing services and patterns are reused where practical.
- New logic is placed in the correct module.
- API calls are isolated in services.
- UI components avoid avoidable business logic.
- No full rewrite or unrelated refactor is included.

## UX

User-facing screens must handle loading state, empty state, error state, permission-restricted state, and responsive layout where practical.

## RiskOps

- Risk signals are explainable.
- Source data is traceable.
- No black-box automated decisioning.
- No autonomous credit, accounting, or transaction action.

## Test and Build

```bash
npm ci
npm run lint
npm run test:ci
npm run build:prod
```

If any check cannot be run, the PR must state why.

## Documentation

- Relevant documentation is updated.
- PR includes changed files, routes, APIs/reports used, known limitations, and screenshots for UI changes.

## Human Approval

Human reviewer approves business correctness, architecture fit, UI/UX acceptability, and merge readiness.
