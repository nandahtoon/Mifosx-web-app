# AGENTS.md - Mifos® X Web App Guidelines

Welcome, AI Coding Agent! This file provides the necessary context and strict instructions required to successfully assist in the development of the [Mifos® X Web App](https://github.com/openMF/web-app), built alongside the Apache Fineract® platform.

Your goal is to ensure high-quality, perfectly formatted Angular code that aligns with our strict contribution workflows.

## MicroOps Agent Ownership (Binding)

This repository is owned by **Antigravity 2 — Web Application Owner**.

### Antigravity 2 owns

- `nandahtoon/Mifosx-web-app` end-to-end.
- Upstream synchronization with `openMF/web-app`.
- Angular UI/UX and browser-side orchestration.
- Fineract API client integration and browser authentication/session behavior.
- Web configuration, tests, CI/CD, container build, ARM64 compatibility, and Web deployment artifacts.
- Financial-truth presentation rules: LIVE / EMPTY / ERROR / explicit DEMO only.
- Web-side staging evidence and handoff of an immutable image reference to Infra.

### Antigravity 1 owns

Antigravity 1 remains the **Core Platform / Backend / Infra / Integration owner**, including Fineract-side integration, M01/M02/backend modules, MicroOps-Infra, Oracle runtime administration, and cross-module integration.

Antigravity 1 must not make routine Web App implementation edits in this repository while Antigravity 2 owns the active Web workstream.

### Cross-agent boundary

- The two agents must not edit the same file or implement the same work package concurrently.
- A Web requirement that needs backend/Infra change must be handed off through a GitHub Issue or explicit API contract; do not implement a backend workaround in Angular.
- A backend/Infra requirement that needs a Web change must be handed off to Antigravity 2; do not silently edit Web source from another lane.
- Cross-repository changes require an explicit handoff containing the exact API/config requirement, expected behavior, error behavior, and acceptance criteria.
- If ownership is ambiguous or another agent is actively modifying the same scope, stop that overlapping change and reconcile ownership before continuing.
- Repository boundaries and Fineract-first architecture remain authoritative over convenience.

### Antigravity 2 execution loop

For each coherent Web work package:

`READ → PLAN → IMPLEMENT → TEST → REVIEW → REPAIR → EXACT-HEAD CI → EVIDENCE → HANDOFF`

Do not claim DONE because code landed. A work package is DONE only when required tests, exact-head CI, runtime/visual evidence where applicable, and review gates are satisfied.

### Current Web priority

The Web App has a dedicated modernization/synchronization lane. Antigravity 2 must:

1. compare the current MicroOps `dev` branch with upstream `openMF/web-app:dev`;
2. use a dedicated sync branch rather than overwriting `dev`;
3. preserve approved MicroOps custom behavior;
4. resolve/refactor divergence domain-by-domain;
5. keep fake financial values out of normal live mode;
6. validate login and Fineract API behavior;
7. build an ARM64-compatible immutable image;
8. hand the pinned image digest/version to MicroOps-Infra for Oracle staging deployment;
9. stop before production deployment unless separately authorized.

## OPS-365 / MicroOps Architecture Boundary

This repository is a UI layer, not a core-banking or domain-service repository.

- Apache Fineract is the operational backend/system of record for supported CBS entities and financial transactions.
- Do not implement a duplicate Client, Loan, Savings, transaction, accounting, Office, Staff, User, or Role master in Angular/local browser storage.
- Before proposing a new backend/data store, follow the OPS-365 placement order: Fineract Core → Codes/Reference Data → Identifiers/Documents → Data Tables → Fineract controls → specialized external service only for a proven gap.
- Customer Identity specialized processing, FinSentry/RCC risk intelligence, Field Operations offline orchestration, Odoo integration, and CBS migration remain separate bounded capabilities. The web app may call approved APIs but must not absorb their engines.
- CBS migration/source extraction is not a browser workflow. Never commit or expose source-CBS credentials, raw migration datasets, production PII, financial backups, or privileged Fineract service credentials in frontend code/configuration.
- UI state is presentation state. It is never authoritative financial/customer truth.
- Preserve the upstream Mifos X/Fineract API behavior unless an OPS-365 issue explicitly authorizes a bounded UI change.

## Repository Structure & Context

This is a large-scale financial application. It contains many domain modules (e.g., accounting, clients, loans, savings).

- **`src/app/`**: Contains the core application logic. Wait to see how the app is structured before generating entirely new patterns. It uses Angular lazy-loaded modules.
- **`src/assets/`**: Contains static assets, i18n translation files (`.json`), and customizable environment templates.
- **`src/environments/`**: Contains build-time environment flags.
- **`src/theme/`**: Contains global SCSS and Angular Material custom thematic overrides.
- **`skills/SKILL.md`**: Contains MUST-FOLLOW procedural constraints for AI UI generation (Material UI, i18n variables, file headers). ALWAYS read this before generating components.
- **Domain Context**: Mifos/Fineract handles financial objects. "Clients" have "Savings" and "Loans". "Offices" are branches. "Centers" and "Groups" are for microfinance group-lending methodologies.
- **Data Flow**: The UI interacts with Apache Fineract almost exclusively via REST. Expect payload structures to be strictly defined by the Fineract API specification.
- **State Management**: The app relies heavily on RxJS Observables and route resolvers to fetch and pass data rather than a unified predictable state container like NgRx.

## Environment & Architecture Context

- **Framework:** Angular v20, using TypeScript and SCSS.
- **UI Component Library:** Angular Material. All visual components must strictly use Angular Material elements (e.g., `<mat-card>`, `<mat-select>`) instead of native HTML where possible.
- **Backend:** Apache Fineract®.
- **Proxying:** `npm start` uses `proxy.conf.js` to avoid CORS issues during local dev to a remote instance (e.g., `https://demo.mifos.community`). Use `ng serve --proxy-config proxy.localhost.conf.js` when developing against a `localhost:8443` Fineract instance.

## Testing & Linting Instructions

Always make sure the code meets our quality and styling standards before committing.

- **Run Formatting:** Use `npx prettier --write .` before closing any branch. We enforce Prettier formatting.
- **Linting:** Run `npm run lint` (which runs `eslint`, `stylelint`, `prettier`, and `htmlhint`). A CI pipeline will block the PR if this fails.
- **Tests:** Run Jest unit tests using `npm run test` or `npm run test:watch`. E2E tests are handled by Playwright and Cypress. Run them via `npm run playwright` or `npm run e2e` respectively.
- **File Headers:** Always run `npm run headers:check` and `npm run headers:add` to ensure new files have the correct open source license file headers.
- **Translations:** Since the app uses `@ngx-translate/core`, if you add new strings in code, ensure you use proper i18n variables. Run `npm run translations:extract` to extract these.

## Workflow & PR Instructions

We follow a 7-step Contribution Workflow strictly. Do not deviate from it.

1. **Branching:** ALWAYS create a new branch from `dev`, never `master` or `main`.
2. **Branch Name Convention:** Your branch must follow `WEB-<Jira_ID>-<short-description>`.
3. **Commits:** One Feature = One PR. If multiple commits exist, they must be squashed. Use the same naming convention for your commit: `WEB-<Jira_ID>: <Description>`.
4. **Visual Evidence:** AI coders creating UI change requests MUST inform the user to take "Before" and "After" screenshots manually as they are required for all PR approvals.
5. **Design Aesthetics:** Stick to the 8px grid system. Always leverage SCSS variables defined in `src/main.scss` and `src/theme/mifosx-theme.scss` rather than generating custom classes and explicit pixel values.

## File Organization Rules

- Source code is strictly managed inside the `src/` folder.
- Environment variables exist inside `src/environments/` and `env.sample`. Look at `CONTRIBUTING.md` and `README.md` if encountering variables like $MIFOS_COMPLIANCE_HIDE_CLIENT_DATA.
- Re-use the lodash and moment libraries efficiently. Do not install additional JS dependencies for what `lodash` and `moment` can achieve.

Please apply these standards rigorously across every file modification you make.
