# Architecture Principles

## Goal

Modernize and extend the MifosX Web App while preserving Apache Fineract compatibility and avoiding customer-specific forks.

## Primary Rule

Apache Fineract remains the system of record. This web app is an operations portal, workflow surface, dashboard surface, and productivity layer.

## Principles

1. **Extend, Do Not Rewrite** — keep Angular and existing MifosX architecture unless an ADR approves otherwise.
2. **Configuration Over Customization** — customer differences should use runtime config, tenant config, feature flags, menus, and display settings.
3. **Plugin Over Fork** — optional capabilities should be feature modules or plugin-style extensions.
4. **API First** — new data access belongs in services, not UI components.
5. **Upgrade Safe** — avoid deep changes to core flows when a wrapper or extension module is enough.
6. **Modular First** — keep features in clear bounded contexts.
7. **Smart/Dumb Components** — containers orchestrate; presentation components receive inputs and emit events.
8. **Explainable Risk** — risk indicators must be understandable and traceable.
9. **Secure by Design** — never store secrets or bypass auth, tenant, or permissions.
10. **Testable by Default** — handle loading, empty, error, and permission-restricted states.
11. **Observable and Supportable** — operational failures must be visible and diagnosable.
12. **Commercial Product Thinking** — every feature should improve reusable commercial value.

## Review Questions

Before coding, ask:

- Is this reusable across institutions?
- Can this be configured instead of customized?
- Does this preserve Fineract behavior?
- Will this remain maintainable after one year?
