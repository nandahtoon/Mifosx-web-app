# Sprint 7.1 Performance Audit

Scope: static performance audit only. No code change.

## Findings

### PERF-001: Dashboard uses OnPush but later state work is not visible on dev

Severity: Medium

Dashboard component uses `ChangeDetectionStrategy.OnPush`, which is good.

However, inspected `dev` still shows the earlier dashboard observable shape rather than later state-based loading/error flow.

Recommendation:

- Reconcile later dashboard resilience changes into `dev`.

### PERF-002: Sidenav template is dense

Severity: Medium

The sidenav template contains many direct menu entries and permission directives.

Risk:

- Large templates are harder to reason about and optimize.
- Future enterprise menu grouping may require broad template changes.

Recommendation:

- Later sprint: move menu metadata into typed model.
- Keep visual output stable.

### PERF-003: Heavy dependencies need bundle discipline

Severity: Medium

Chart, graph, PDF, canvas, editor, and animation dependencies are available.

Risk:

- Importing heavy dependencies directly into frequently loaded routes can hurt startup performance.

Recommendation:

- Lazy-load heavy visualization/export/editor features.
- Avoid adding new libraries without a bundle impact note.

## Future Performance Checklist

- Use OnPush for new components.
- Use trackBy for large lists.
- Use virtual scroll for large tables.
- Keep feature routes lazy-loaded.
- Avoid component-level direct subscriptions unless cleanup is explicit.
- Keep API aggregation off hot templates.
