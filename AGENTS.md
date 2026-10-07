# AGENTS.md - Mifos® X Web App Guidelines

Welcome, AI Coding Agent! This file provides the necessary context and strict instructions required to successfully assist in the development of the [Mifos® X Web App](https://github.com/openMF/web-app), built alongside the Apache Fineract® platform.

Your goal is to ensure high-quality, perfectly formatted Angular code that aligns with our strict contribution workflows.

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

## OPS-365 Dedicated Agent 2 Autonomous Delivery Mode

Apply this section when the owner assigns this repository to the dedicated MicroOps Web agent (for example, by saying `Execute PR #<control-pr>`).

### Scope and ownership

- Work only in `nandahtoon/Mifosx-web-app`. Other MicroOps repositories are read-only contract/reference sources.
- Read latest `dev`, this file, `skills/SKILL.md`, relevant runtime/deployment files, all open PRs, and exact-head CI before editing.
- Never push directly to `dev`. Use a fresh task branch from latest `dev`.
- Before editing, detect overlap with active PRs/branches. Reconcile existing work; never race, overwrite, force-push, or duplicate another agent's implementation.
- One coherent work package = one branch = one PR. Prefer one final commit because Single Commit Check is enforced.

### Autonomous GREEN loop

Routine reversible development actions should proceed without stopping for owner confirmation: repository inspection, local git operations, task-branch creation, scoped edits, locked dependency installation, formatting, linting, unit tests, build, supported Fineract API integration tests, Playwright against approved test/staging endpoints, commit/push of the task branch, draft-PR creation/update, CI inspection, and repair/retest loops.

Do not bypass IDE, OS, GitHub, cloud, or security approval controls. If the execution environment itself requires approval for a protected action, request the smallest required approval once. Human approval remains mandatory for production deployment, destructive data/database operations, real PII, credential/key changes or disclosure, destructive history/repository actions, cross-repository writes, and ambiguous financial/accounting decisions.

### Canonical baseline before feature expansion

Reconcile current baseline work before starting unrelated features:

1. Fineract-first architecture truth (current PR #49 or its accepted successor).
2. Optional integration/runtime config truth (current PR #50 or its accepted successor).
3. Dashboard/data truth (current PR #51 or its accepted successor). No fabricated financial or operational values may be presented as live data. Preserve valid workflow launchers when KPI data is unavailable.
4. Environment/template consistency, including boolean parsing, timeout units, optional-service defaults, and the password-regex template mapping.
5. Product/upstream documentation clarity.

Optional integrations such as Remittance, Interbank, Copilot, External National ID, and Postal Lookup are OFF by default unless explicitly configured.

### Fineract integration rule

For every major usable milestone verify the complete path:

`Browser → runtime config → authenticated Fineract REST API → synthetic staging response → UI state → refresh/server truth`

Use supported Fineract REST APIs only. Never direct-write the Fineract database. Never create browser-side substitutes for missing backend contracts. Record a missing required capability as `BLOCKED_BY_BACKEND_CONTRACT`.

### Live staging evidence

The owner requires browser-visible outcomes. After each major coherent milestone, deploy/update the approved MicroOps staging Web through the repository CI/CD path when available and report:

- live staging URL,
- exact commit SHA and PR,
- build/deployment identifier when available,
- Fineract endpoint/tenant class used without secrets,
- smoke/E2E result,
- visibly usable workflow,
- known limitations.

Do not deploy every tiny commit. Deploy a coherent browser-usable milestone. Production deployment is out of scope unless separately approved.

Target delivery path:

`task branch → PR → lint/unit/build/license → Playwright/Fineract integration → accepted dev baseline → immutable Web artifact/container → staging deploy → health/smoke → browser E2E → evidence`

Deployment configuration must be config-driven; do not hard-code staging IP/FQDN in Angular source.

### Milestone Definition of Done

`Code + tests + verified Fineract contract + required exact-head CI green + accepted baseline + staging browser evidence + documentation/status update`

Code existing alone is not DONE. CI green alone is not Operationally Ready. A screenshot alone is not proof of backend truth.

Report only when a substantive milestone completes, a RED/human decision is required, a protected operation needs explicit approval, or an unexpected architecture/security/accounting risk appears.
