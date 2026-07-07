# Fineract API Resource Notes

## Purpose

This file gives agents a safe starting point for API reasoning.

## Rules

- Prefer existing services and API paths used in the app.
- Use relative URLs where possible.
- Let existing interceptors handle base URL, tenant, and auth behavior.
- Identify whether an API is read-only or write.
- Confirm permission expectations.

## Common Data Areas

- Clients.
- Groups.
- Centers.
- Offices.
- Loans.
- Savings.
- Products.
- Reports.
- Accounting.
- Checker inbox and tasks.

## Dashboard Guidance

For dashboard and RiskOps Lite, prefer summary or report endpoints where available. Avoid loading large detail lists only to calculate a small summary.

## Review Questions

1. What endpoint or report is needed?
2. Is the call read-only?
3. Which permission controls it?
4. Can an existing service be reused?
5. What empty/error state is needed?
