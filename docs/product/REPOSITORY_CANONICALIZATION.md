# MicroOps 360 Web Repository Canonicalization

Tracking: `nandahtoon/RCC#268`.

## Decision

This repository is the canonical implementation for the MicroOps 360 Web product line and is intended to be renamed to `nandahtoon/MicroOps-360-Web` after consolidation.

The lightweight repository `nandahtoon/nandahtoon-mifosx-enterprise-web` is a product-scope and guardrail seed. Its useful guidance is incorporated here; it must not become a second implementation.

## Product scope

MicroOps 360 Web provides the Angular-based, Apache Fineract-compatible operational experience for:

- client and group management
- loan origination and servicing workflows
- collection and repayment operations
- savings operations
- reports and operational dashboards
- branch, teller, task, approval, and exception visibility
- branding, localization, role-based presentation, and deployment configuration

## Guardrails

- Preserve Angular, TypeScript, SCSS, and Angular Material unless an explicit architecture decision approves a change.
- Do not perform a React rewrite.
- Do not mix Odoo or unrelated ERP responsibilities into this repository.
- Do not change Apache Fineract API contracts without explicit review and evidence.
- Keep inherited openMF attribution and licensing requirements intact.
- Use small, reviewable changes with automated checks and human approval.
- Reference AiSFT as a delivery method; do not copy the full AiSFT framework into this product repository.

## Relationship with FinSentry

MicroOps owns transactional operational workflows and CBS-facing user actions.

FinSentry owns risk intelligence, portfolio monitoring, alerts, investigations, explainability, collection prioritization, policy simulation, and executive oversight.

Integration must use explicit APIs and data contracts. FinSentry must not become the financial ledger or silently mutate authoritative transactions.

## Initial modernization priorities

1. High-density portfolio and operational dashboard.
2. KPI, PAR, task, approval, alert, recent-loan, product, and branch visibility.
3. Responsive and accessible UI modernization without breaking Fineract compatibility.
4. Clear configuration and environment boundaries.
5. Repeatable Docker-based deployment and support documentation.

## Final administrator action

After the duplicate shell repository is reviewed and archived, rename this repository to `nandahtoon/MicroOps-360-Web` through GitHub repository settings. Repository rename is not exposed by the connected GitHub actions.
