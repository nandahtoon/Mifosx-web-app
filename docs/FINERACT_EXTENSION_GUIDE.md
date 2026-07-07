# Apache Fineract Extension Guide

## Purpose

This repository extends the MifosX Web App experience while preserving Apache Fineract compatibility.

## System of Record

Apache Fineract remains the system of record for core financial data and operations. The web app must not duplicate or replace Fineract business authority.

## Rules

1. Use existing Fineract APIs and reports first.
2. Preserve tenant header behavior through existing interceptors.
3. Preserve Basic, OAuth, and OIDC authentication behavior.
4. Respect existing roles and permissions.
5. Avoid core workflow changes unless explicitly approved.
6. Use read-only aggregation for dashboards.
7. Explain risk signals and link to source data where practical.
8. Keep upgrade safety in mind.

## High-Risk Areas

Explicit approval is required for changes involving:

- Loan creation.
- Disbursement.
- Repayment.
- Waiver.
- Write-off.
- Reschedule/restructure.
- Savings transactions.
- Journal entries.
- Maker-checker approvals.
- Authentication/session handling.

## Review Questions

Before implementation, answer:

1. Which Fineract API or report endpoint is used?
2. Is this read-only or write action?
3. Which permission controls it?
4. Which tenant behavior is expected?
5. What existing workflow could be affected?
6. Can this be implemented without backend change?

## Integration Rule

This repository may include integration UI, links, status views, and configuration screens. Full connector engines belong outside this repository unless explicitly approved.
