# Project Scope

## Product Identity

This repository is the **MifosX Commercial Operations Portal (MCOP)**: an upgrade-safe commercial extension of the MifosX Web App for Apache Fineract-based financial institutions.

## Strategic Position

This repository is not the full Universal Financial Operations Platform. It is the Fineract/MifosX provider portal that can later connect to a future universal platform.

## Principles

- Never rewrite Apache Fineract.
- Never rewrite the whole MifosX Web App.
- Never create customer-specific frontend forks.
- Extend instead of replace.
- Configuration over customization.
- Plugin over fork.
- API first.
- Upgrade-safe.
- Multi-tenant ready.
- AI-ready.
- Commercial SaaS ready.

## In Scope

- Executive dashboard.
- Portfolio dashboard.
- Client 360.
- Loan 360.
- Collection workspace.
- Branch workspace.
- Field officer workspace.
- Task and approval workspace.
- RiskOps Lite.
- Tenant branding.
- Feature flags.
- Configurable menus.
- Country and localization configuration.
- Read-only AI Copilot.
- Odoo launcher or integration UI.

## Out of Scope

- Universal multi-CBS adapter framework.
- Universal business model.
- Universal field mapping engine.
- Plugin marketplace.
- Universal workflow platform.
- Payment hub.
- Accounting connector framework.
- Integration hub.
- Cross-CBS AI platform.

These belong in a future separate repository such as `universal-finops-platform`.

## Future Relationship

```text
Universal Financial Operations Platform
        |
        v
Provider Adapter Layer
        |
        v
MifosX Commercial Operations Portal
        |
        v
Apache Fineract
```

## Success Criteria

The repository must remain compatible with Apache Fineract, upgrade-safe with MifosX direction, modular, testable, secure, observable, maintainable, and commercially deployable.
