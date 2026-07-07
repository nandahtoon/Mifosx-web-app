# Architecture Context

## Architecture Position

This application is an Angular web app on top of Apache Fineract REST APIs.

Apache Fineract remains the system of record. The web app is a user interface, productivity layer, dashboard layer, and operational visibility layer.

## Key Patterns

- Angular feature modules.
- Lazy-loaded routes.
- RxJS observables.
- Route resolvers.
- Angular Material components.
- Centralized HTTP behavior through interceptors.
- Environment and runtime configuration.

## Design Rules

- Do not rewrite the app.
- Do not bypass existing interceptors.
- Do not duplicate tenant or auth handling in each service.
- Put API calls in services.
- Keep UI components focused.
- Reuse shared components where practical.
- Add new feature modules only when justified.

## Preferred Feature Areas

- Dashboard.
- RiskOps Lite.
- AI Copilot UI.
- Collection workspace.
- Client 360.
- Loan 360.

## Review Questions

Before implementation, ask:

1. Which existing module is closest?
2. Which service pattern should be reused?
3. Which route is affected?
4. Which Fineract API or report is needed?
5. What existing workflow could be affected?
