# Dashboard Skill

## Purpose

Use this skill when building dashboard widgets or dashboard pages.

## Rules

- Keep dashboard widgets read-only.
- Use existing Fineract APIs or reports first.
- Load summary data before detail data.
- Include loading, empty, and error states.
- Link summary cards to source screens where practical.
- Do not change existing financial workflows.

## Widget Types

- KPI card.
- Collection summary.
- Arrears summary.
- Branch summary table.
- Risk signal card.
- Task summary.

## Checklist

- [ ] Business meaning is clear.
- [ ] Data source is identified.
- [ ] Tenant/auth behavior preserved.
- [ ] Widget handles no-data case.
- [ ] Widget handles API error case.
- [ ] Drill-down path considered.
