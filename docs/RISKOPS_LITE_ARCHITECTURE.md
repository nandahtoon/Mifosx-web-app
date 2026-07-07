# RiskOps Lite Architecture

## Purpose

RiskOps Lite adds explainable operational risk visibility to the MifosX Web App without replacing Apache Fineract and without black-box decisioning.

## In Scope

- PAR visibility.
- Arrears visibility.
- Restructure surveillance.
- Renewal and evergreening warnings.
- Branch risk summary.
- Field officer risk summary.
- Portfolio concentration summary.
- Promise-to-pay visibility.
- Collection exception indicators.

## Out of Scope

- Automated credit approval.
- Automated loan rejection.
- Automated write-off.
- Automated restructuring.
- Black-box scoring.
- Replacement of official Fineract reports.

## Design Principles

1. **Explainable First** — every signal explains what happened, why it matters, source data, and next review action.
2. **Source Traceability** — link to client, loan, group, center, office, or report where practical.
3. **Rule-Based First** — start with deterministic indicators before AI/ML.
4. **Tenant Configurable** — thresholds should become configurable.
5. **No Hidden Action** — RiskOps Lite explains and routes; it does not perform financial actions.

## MVP Signals

- PAR summary.
- Overdue loan watchlist.
- Restructured loan watchlist.
- Renewal warning list.
- Branch risk table.
- Loan officer risk table.

## Definition of Done

- Signals are explainable.
- Source links exist where practical.
- Empty and error states exist.
- Existing workflows are not changed.
- No autonomous decisioning is introduced.
