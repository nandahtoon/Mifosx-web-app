# AGENTS.md - MifosX Commercial Operations Portal Guidelines

Welcome, AI Coding Agent.

This repository is the **MifosX Commercial Operations Portal (MCOP)**, an upgrade-safe commercial extension of the MifosX Web App for Apache Fineract-based operations.

This file applies to Google Antigravity, Codex, Copilot, and any other AI-assisted development tool working in this repository.

## Product Boundary

This repo extends the MifosX Web App. It is not the future Universal Financial Operations Platform.

Keep universal multi-CBS platform work outside this repo unless the owner explicitly approves it.

## Non-Negotiable Rules

- Keep Angular.
- Do not rewrite the app.
- Do not replace Apache Fineract.
- Do not create customer-specific frontend forks.
- Reuse existing modules, services, routes, resolvers, Angular Material patterns, and interceptors.
- Keep pull requests small.
- Prefer configuration and feature modules over one-off code.
- Preserve tenant, auth, permission, accounting, loan, client, savings, report, and maker-checker behavior.

## Repository Structure and Context

- `src/app/`: Core application logic using Angular lazy-loaded modules.
- `src/assets/`: Static assets, i18n translation files, and runtime templates.
- `src/environments/`: Build-time environment flags.
- `src/theme/`: Global SCSS and Angular Material theme overrides.
- `skills/SKILL.md`: Additional AI UI generation constraints.
- `docs/`: Product scope, governance, architecture, and AI workflow guidance.

## Domain Context

Mifos/Fineract handles financial objects such as clients, savings, loans, offices, centers, and groups. The UI interacts with Apache Fineract primarily through REST APIs. Payloads must remain compatible with Fineract behavior.

## Environment and Architecture Context

- Framework: Angular v20, TypeScript, SCSS.
- UI Library: Angular Material.
- Backend: Apache Fineract.
- State/Data Flow: RxJS Observables and route resolvers are commonly used.
- Local proxy: `npm start` uses `proxy.conf.js`; use `proxy.localhost.conf.js` for local Fineract development.

## Human-in-the-Loop

AI may plan and implement. Humans approve requirements, architecture, business behavior, UI/UX, merge, and release readiness.

When unsure, stop and ask for human approval.

## Before Coding

Answer:

1. What problem is being solved?
2. Which existing module can be reused?
3. Which Fineract API or report is used?
4. What workflow may be affected?
5. What is the smallest safe PR?

## Recommended Work

- Dashboard improvements.
- Client 360.
- Loan 360.
- Collection workspace.
- RiskOps Lite indicators.
- Read-only AI Copilot UI.
- Tenant branding.
- Feature flag UI.
- Documentation and tests.

## Approval Required

Ask before changing authentication, permissions, loan workflows, repayment workflows, savings workflows, accounting workflows, maker-checker workflows, major routes, or dependencies.

## Testing and Linting

Run or explain why not:

```bash
npm ci
npm run lint
npm run test:ci
npm run build:prod
```

Also follow existing project checks for headers, translations, formatting, and UI evidence when applicable.

## Workflow and PR Instructions

- Create a branch from `dev`.
- One feature equals one focused PR.
- Avoid unrelated formatting changes.
- Include screenshots for UI changes.
- Follow `.github/PULL_REQUEST_TEMPLATE.md`.

## Read First

- `docs/PROJECT_SCOPE.md`
- `docs/AI_DEVELOPMENT_WORKFLOW.md`
- `docs/ARCHITECTURE_PRINCIPLES.md`
- `docs/DEFINITION_OF_DONE.md`
- `docs/FINERACT_EXTENSION_GUIDE.md`
- `docs/RISKOPS_LITE_ARCHITECTURE.md`
- `docs/AI_COPILOT_ARCHITECTURE.md`
- `docs/CONTRIBUTING_AI.md`

Apply these standards rigorously across every file modification.
