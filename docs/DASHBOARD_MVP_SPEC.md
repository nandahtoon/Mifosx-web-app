# Dashboard MVP Specification

## Purpose

Create a modern dashboard for management and branch operations while preserving existing MifosX and Apache Fineract workflows.

## Goals

- Give users a fast portfolio overview.
- Surface collection and arrears status.
- Surface pending operational work.
- Show explainable risk signals.
- Avoid changing financial workflows.

## MVP Widgets

## 1. Portfolio Summary

Shows active loans, outstanding portfolio, total clients, and active borrowers.

## 2. Collection Summary

Shows due today, collected today where available, overdue amount, and collection rate where available.

## 3. Arrears Summary

Shows loans in arrears, amount in arrears, and PAR buckets where available.

## 4. Branch / Office Summary

Shows portfolio by office, arrears by office, and collection progress by office where available.

## 5. Task Summary

Shows pending maker-checker items, pending approvals, and operational exceptions where available.

## 6. Risk Signal Cards

Shows explainable indicators such as high arrears concentration, restructure watchlist, renewal watchlist, and branch risk warning.

## Technical Guidance

- Use existing Fineract APIs or report endpoints first.
- Keep widgets read-only.
- Keep data access in services.
- Use existing tenant/auth interceptors.
- Add loading, empty, and error states.
- Do not change existing client, loan, savings, accounting, or maker-checker workflows.

## Suggested Structure

```text
src/app/dashboard/
  dashboard.module.ts
  dashboard-routing.module.ts
  dashboard.component.ts
  dashboard.component.html
  dashboard.component.scss
  dashboard.service.ts
  components/
    kpi-card/
    collection-summary/
    arrears-summary/
    branch-summary-table/
    risk-signal-card/
```

## Acceptance Criteria

- Dashboard loads after sign-in.
- Existing routes still work.
- Tenant and auth behavior are preserved.
- Empty data is handled.
- API errors are handled.
- Production build passes.
