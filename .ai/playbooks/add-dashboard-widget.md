# Playbook: Add Dashboard Widget

## Goal

Add one focused dashboard widget without changing existing workflows.

## Steps

1. Read `docs/DASHBOARD_MVP_SPEC.md`.
2. Identify business meaning of the widget.
3. Identify existing Fineract API or report source.
4. Create or reuse dashboard service method.
5. Create focused component.
6. Add loading, empty, and error states.
7. Add drill-down link where practical.
8. Update documentation if needed.
9. Run checks or explain why not.

## Output

PR must report:

- Files changed.
- Data source.
- Route affected.
- Checks run.
- Known limitations.
