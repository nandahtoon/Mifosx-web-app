# M1 — Operational Workspace Staging Deployment Handoff

This document defines the formal cross-boundary deployment handoff contract from **Antigravity 2 (Web Application Owner)** to **Antigravity 1 (Core Platform / Infra Owner)** for Phase M1 of `nandahtoon/Mifosx-web-app`.

In accordance with [`.github/AGENT-OWNERSHIP.md`](../../.github/AGENT-OWNERSHIP.md) and [`AGENTS.md`](../../AGENTS.md), this contract satisfies all required non-overlap specifications.

---

## 1. Exact Requirement

Deploy the updated MicroOps Mifos X Web Application container image built from the accepted Phase M1 baseline (`dev` branch) to the staging environment (`btk-fineract-staging`), replacing the legacy `openmf/web-app:1.15.0` container instance (`btk-fineract-staging-mifos-web-1`) on port `4200` (container port `80`).

---

## 2. Owning Repository / Module

- **Source Code & Web Application Image**: `nandahtoon/Mifosx-web-app` (Owned by Antigravity 2).
- **Staging Orchestration & Infrastructure**: `MicroOps-360-Fineract-Org` (`deploy/fineract/compose.staging.yaml`, `deploy/fineract/compose.staging-ui.yaml`) (Owned by Antigravity 1).

---

## 3. Container Artifact Specification & Registry Pointers

### Image Architecture & Multi-Arch Verification

- **Target Architectures**: Multi-arch `linux/amd64` and `linux/arm64` (compatible with Oracle Cloud Ampere A1 ARM64 and local AMD64).
- **Builder Stage**: `node:24-alpine3.23` with `--platform=$BUILDPLATFORM` for native build performance across architectures.
- **Runtime Stage**: `nginx:1.31.1-alpine3.23-slim` with native multi-arch manifests and `/usr/bin/envsubst` runtime template substitution.
- **Local Staging Verified Image**: `mifos-web:dev-87787944`
  - Manifest List / Config SHA: `sha256:03380ba8f7b556e1cd75e15c4bd2fe01406f962f447b662a6d0530fe60126647`
  - Local Image ID: `61dba949883e`
- **GitHub Container Registry (GHCR) Targets**:
  - `ghcr.io/nandahtoon/mifosx-web-app:dev`
  - `ghcr.io/nandahtoon/mifosx-web-app:dev-87787944`
  - `ghcr.io/nandahtoon/mifosx-web-app:87787944b0e9f7fbe1fae49577436c1ef6d58629`

---

## 4. API & Runtime Configuration Contract

The staging container consumes environment variables substituted at container startup into `/usr/share/nginx/html/assets/env.js`:

```env
# Backend Connectivity
FINERACT_PLATFORM_TENANT_IDENTIFIER=btk-staging
FINERACT_PLATFORM_TENANTS_IDENTIFIER=btk-staging
FINERACT_API_URL=https://127.0.0.1:8444
FINERACT_API_URLS=https://127.0.0.1:8444
FINERACT_API_PROVIDER=/fineract-provider/api
FINERACT_API_VERSION=/v1
FINERACT_API_ACTUATOR=/fineract-provider

# Application Runtime Configuration
MIFOS_PRODUCTION_MODE=false
MIFOS_DEFAULT_LANGUAGE=en-US
MIFOS_DISPLAY_TENANT_SELECTOR=false
MIFOS_ALLOW_SERVER_SWITCH_SELECTOR=false
MIFOS_DISPLAY_BACKEND_INFO=true
MIFOS_OAUTH_SERVER_ENABLED=false

# Role-Based Access Control (RBAC)
# Controls presentation-level menu/button filtering; Fineract server authorization remains authoritative
MIFOS_PRODUCTION_MODE_ENABLE_RBAC=true

# Optional Integrations (Disabled by default)
MIFOS_REMITTANCE_ENABLED=false
MIFOS_INTERBANK_TRANSFERS_ENABLED=false
MIFOS_ENABLE_COPILOT=false
ENABLE_EXTERNAL_NATIONAL_ID_SYSTEM=false
ENABLE_POSTAL_CODE_LOOKUP=false
```

---

## 5. Expected Success Behavior

1. **Live Operational Workspace**:
   Upon authentication with staging credentials (`mifos` / `password` or role-based user), the Operations Workspace (`/dashboard`) automatically queries live Apache Fineract REST endpoints:
   - Maker-Checker Pending Inbox (`/makercheckers`)
   - Rescheduled Loan Approvals (`/rescheduleloans`)
   - Loans Pending Approval (`/loans?status=100`)
   - Loans Awaiting Disbursement (`/loans?status=200`)
   - Pending Client Activations (`/clients?status=pending`)
   - Active Savings Accounts (`/savingsaccounts`)
   - Recent Loans List (`/loans?limit=5`)
2. **Permission-Aware Quick Actions**:
   Quick action process buttons (`New Loan Application`, `Register Client`, `Maker-Checker Inbox`, `Pending Approvals`, etc.) dynamically filter based on user permissions when `MIFOS_PRODUCTION_MODE_ENABLE_RBAC=true`.
3. **Actionable Navigation**:
   All alert cards, queue cards, and recent loan rows link directly to operational routes (`/tasks/checker-inbox-and-super-user-checks`, `/loans-accounts/create`, `/clients/create`, `/loans-accounts/:id/general`).
4. **Universal Search Integration**:
   Navigation search routes through `/search?q=...` directly resolving against Fineract's entity search index.

---

## 6. Error & Failure Behavior

1. **Unauthorized Session (401 / 403)**:
   The workspace switches to the `unauthorized` card with an actionable "Sign in or switch account" retry button.
2. **Endpoint Errors or Non-configured Queues (404 / 500)**:
   Each query is isolated via RxJS `catchError`. Errored queues fail closed (count 0), allowing remaining operational queues to render without blank screen or uncaught exception crashes.
3. **Financial Truth Guarantee**:
   Zero mock or fabricated numbers appear as live metrics. Unavailable charts (e.g., Portfolio Trend, PAR) fail closed and remain hidden until backed by real Fineract reporting APIs.

---

## 7. Acceptance Criteria & Verification Evidence

1. **HTTP Health**: Container starts and serves `index.html` with status `200 OK` on port `4200`.
2. **CI Pipeline Evidence**:
   - `Playwright E2E`: 39/39 passing against PostgreSQL + Apache Fineract (Run ID `37623190806`).
   - `Run Lint, Test and Build`: Passing with zero errors (Run ID `37623190827`).
   - `Single Commit Check`: Passing (Run ID `37623190833`).
   - `Validate MPL-2.0 Headers`: Passing (Run ID `37623190832`).
3. **Multi-Arch Docker Build**:
   - Both `linux/amd64` and `linux/arm64` supported by base images and Buildx compilation.
   - Entrypoint `envsubst` runs successfully, generating compliant `assets/env.js`.
4. **Smoke Verification on Staging Stack**:
   - Staging Fineract instance (`btk-fineract-staging-fineract-1`) actuator health returns `{"status":"UP","groups":["liveness","readiness"]}`.
   - Staging Web instance serves modern Angular 20 application with correct tenant identifier `btk-staging`.
