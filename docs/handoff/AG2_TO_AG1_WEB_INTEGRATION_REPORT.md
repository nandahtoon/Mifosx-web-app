# AG2 to AG1 Web Integration Report — Management Units (Web PR #65)

**Task Anchor:** Web PR #65 (Program #127)  
**Counterpart Tasks:** AG1 Org #144 (PR #146) · GPTInfra Infra #60 · AG3 Infra #53  
**Date:** October 12, 2026 (ET); earlier probes below are historical.  
**Author:** Antigravity 2 (Web Application Owner)  
**Verdict:** `M01_UNIT_READONLY_VERTICAL_SLICE` = **NOT PASS / BLOCKED (PROVISIONAL SCHEMA COMPATIBILITY PASS)**.  
The Unit REST API is **NOT_IMPLEMENTED** at runtime. The Web Units tab is demo-fixture-only.

> [!IMPORTANT]
> The Units screen evidence documented here is strictly produced from the local demo fixture (`CANONICAL_M01_UNITS`). The login, office directory, and dashboard screens were verified against the real local CBS backend, but zero Unit data is served by a live backend daemon. This does NOT constitute an end-to-end runtime PASS.

---

## 1. Exact Sources Compared

| Component                   | Repository & Branch                                                                    | Exact Commit SHA                           | Artifact / Path                                                          |
| :-------------------------- | :------------------------------------------------------------------------------------- | :----------------------------------------- | :----------------------------------------------------------------------- |
| **Web Consumer**            | `Mifosx-web-app` (PR #65)<br/>`WEB-365-office-geography-and-unit-navigation`           | Working Head                               | `src/app/organization/offices/view-office/management-units-tab/*`        |
| **AG1 Reconciled Schema**   | `MicroOps-360-Fineract-Org` (draft PR #146, Issue #144)                                | `bbef87e9107efe7aa10851e385624cd0497a4e9f` | `profiles/schema/management-unit-web-contract.schema.json` (provisional) |
| **AG1 Superseded Proposal** | `MicroOps-360-Fineract-Org` (PR #140)<br/>`feat/124-management-unit-contract-and-plan` | `ca7ee9d4993517fab0aeeb8b45fee9d4f160c5b0` | `docs/handoffs/management-unit-web-contract.md` (OLD / DEPRECATED)       |
| **Canonical Roadmap**       | `MicroOps-360-Fineract-Org`<br/>`main`                                                 | `0e207954ff7868b08cad5f24f79d2d32bcb9f31b` | `governance/program-delivery-roadmap.yaml`                               |

---

## 2. Governance HOLD Verification

- **Roadmap Baseline (`main@0e207954`)**:
  - `Office geography/address/PCode operator surface (#123) = HOLD`
  - `Management Unit runtime/UI operationalization (#124) = HOLD`
  - `Web operator UI state = CONTROLLED_PAUSE` ("New feature expansion = HOLD")
- **Owner Scope Exception (Org #124, 2026-10-08)**:
  - Earlier blanket HOLD was superseded **only for the smallest GREEN local contract/synthetic implementation increment**.
  - AG2 "must use AG1 accepted contract or visibly synthetic/local read-only placeholders and cannot invent mutable Unit runtime API."
- **PR #146 Status**:
  - AG1 PR #146 is in **DRAFT** status.
  - The reconciled schema `management-unit-web-contract.schema.json` (v1.1.0) is a proposed draft contract; full runtime activation remains blocked pending owner acceptance.
- **Execution Boundary Applied by AG2**:
  - Zero runtime mutations, zero customer data writes, zero simulated backend daemons.
  - Test-only consumer validation added; PR #65 remains open with zero merge/deploy.

---

## 3. Real Unit REST API Availability (Runtime Truth)

Live gateway probes executed against APISIX 3.18.0 loopback gateway on `http://127.0.0.1:9080` (2026-10-11T02:10Z):

| Endpoint Probe                                 |    HTTP Status    | Response Payload                      | Objective Finding     |
| :--------------------------------------------- | :---------------: | :------------------------------------ | :-------------------- |
| `GET /api/v1/units`                            | **404 Not Found** | `{"error_msg":"404 Route Not Found"}` | **NOT_IMPLEMENTED**   |
| `GET /api/v1/branches/btk-br-ygn-thl-01/units` | **404 Not Found** | `{"error_msg":"404 Route Not Found"}` | **NOT_IMPLEMENTED**   |
| `GET /api/v1/units/btk-unit-ygn-thl-01-01`     | **404 Not Found** | `{"error_msg":"404 Route Not Found"}` | **NOT_IMPLEMENTED**   |
| `GET /fineract-provider/actuator/health`       |    **200 OK**     | `{"status":"UP"}`                     | Live CBS Route Active |

### Backend Service Audit (AG1 PR #146 & PR #140)

- Exhaustive search of codebase in `MicroOps-360-Fineract-Org` shows **zero HTTP server frameworks** (FastAPI, Flask, aiohttp, Express, etc.).
- `bootstrap/unit_plan.py` and `scripts/plan_management_units.py` are batch CLI planners and validation scripts, not an HTTP daemon.
- **Conclusion**: The Unit REST endpoints exist in documentation and schema only. They are **NOT_IMPLEMENTED** on any running service. Per Infra #60, no open `/api/v1/*` proxy wildcard route was added.

---

## 4. Reconciled Contract Schema Validation (AG1 PR #146 v1.1.0)

In response to AG2 findings, AG1 delivered PR #146 reconciling the canonical contract schema (`management-unit-web-contract.schema.json`) to accommodate the Web DTO.

### Machine-Verifiable Validation Evidence

Consumer contract test suite (`management-units-contract.spec.ts`) compiles the canonical schema using `Ajv2020` and validates all 5 units in `CANONICAL_M01_UNITS`:

- `btk-unit-ygn-thl-01-01` (Thanlyin Branch 01 Unit 01): **PASS** (0 schema errors)
- `btk-unit-ygn-thl-02-01` (Thanlyin Branch 02 Unit 01): **PASS** (0 schema errors)
- `btk-unit-ygn-thl-03-01` (Thanlyin Branch 03 Unit 01): **PASS** (0 schema errors)
- `btk-unit-ygn-twt-01-01` (Twantay Branch 01 Unit 01): **PASS** (0 schema errors)
- `btk-unit-ygn-twt-02-01` (Twantay Branch 02 Unit 01): **PASS** (0 schema errors)

**Overall Schema Conformance:** **100% PASS** on representative Web fixtures.

---

## 5. Explicit Field Classification (provisional draft required vs. deferred)

| Field / Capability                      | Reconciled v1 Schema Status   | Classification            | Architectural Rationale                                                                                                                                 |
| :-------------------------------------- | :---------------------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `manager.name`                          | **Required** in v1 schema     | **Draft schema required** | Reconciled directly to Web DTO; `displayName` accepted as optional alias.                                                                               |
| `staffedLoanOfficerPositions`           | **Required** in v1 schema     | **Draft schema required** | Reconciled directly to Web DTO; `activeLoanOfficerCount` accepted as optional alias.                                                                    |
| `capacityMetrics`                       | **Required** in v1 schema     | **Draft schema required** | Reconciled to summary object (`activeClients, activeGroups, activeCenters, portfolioSignal, advisoryStatus`).                                           |
| `isSimulated`                           | **Optional** in v1 schema     | **DEFERRED / OPTIONAL**   | Metadata flag for synthetic vs native staff; not required on Web DTO. Schema accepts omission cleanly.                                                  |
| `hasTemporaryOverlay`                   | **Optional** in v1 schema     | **DEFERRED / OPTIONAL**   | Optional boolean indicator; client does not parse active overlay flags until runtime scope resolver is operational.                                     |
| `effectiveOverlays[]`                   | **Omitted** from v1 schema    | **DEFERRED**              | Full overlay array deferred from v1 Web contract until server-side scope resolver is active.                                                            |
| Detailed Thresholds (`warning`, `hard`) | **Omitted** from v1 schema    | **DEFERRED**              | Detailed warning/hard metric trees deferred; v1 schema requires summary signal enums (`HEALTHY/WARNING/BREACH`, `NORMAL / TARGET/WARNING/HARD BREACH`). |
| RFC 7807 Error Interception             | **Documented** in v1 contract | **DEFERRED**              | Web client issues zero HTTP calls for units in M01; error handling will be wired when runtime REST endpoints exist.                                     |

---

## 6. Historical Drift Snapshot vs. Superseded PR #140 Proposal (OLD / DEPRECATED)

The initial proposal in AG1 PR #140 (`ca7ee9d`) contained wide schema divergences against the Web DTO. These divergences are pinned in unit tests under `OLD / DEPRECATED` to prevent accidental regression:

- Manager: `displayName` (PR #140) vs `name` (Web)
- Staffed count: `activeLoanOfficerCount` (PR #140) vs `staffedLoanOfficerPositions` (Web)
- Capacity: nested `capacity.metrics` with thresholds (PR #140) vs flat `capacityMetrics` (Web)
- Severity: `NORMAL / TREND / REVIEW / HARD` (PR #140) had zero vocabulary overlap with Web DTO (`NORMAL / TARGET`, `WARNING`, `HARD BREACH`).
- Status: hardcoded `ACTIVE` (PR #140) vs enum `PLANNED` (Web).

The positive tests below cover representative Web fixtures against the reconciled draft schema. This does not establish accepted runtime compatibility or resolve the deferred capabilities in section 5.

---

## 7. Web Behavior & Consumer Safety Invariants

1. **Live Mode Safety**:
   - In standard live mode (`demoMode: false`), the Units tab displays an honest `NOT CONFIGURED` empty state.
   - Verified: **Zero HTTP requests** are issued to `/api/v1/units` or any other nonexistent endpoint.
2. **Demo Mode Gating**:
   - Demo mode is strictly opt-in (`?demo=true`, `window.env.demoMode`, `environment.demoMode`).
   - Renders `CANONICAL_M01_UNITS` under clear `[DEMO PREVIEW]` and `ADVISORY ONLY` banners.
   - All 5 units remain explicitly `PLANNED` with synthetic IDs (`btk-unit-*`, `BTK-STG-STAFF-*`).
3. **Head Office Scope**:
   - Head Office is identified as a corporate coordination tier (`Boolean(officeData?.id) && !officeData?.parentId`), rendering the corporate hierarchy notice with zero field units.
   - Numeric ID assumption (`id === 1`) has been eliminated; Fineract root is cleanly identified by `Boolean(id) && !parentId`.
4. **Browser Non-Authority**:
   - The Web app does not assert or derive authorization from browser role strings. Assignment data is presented strictly as server-provided facts per AG1 contract §5.

---

## 8. Consumer Test Suite & Exact-Head CI Status

Consumer contract spec: `src/app/organization/offices/view-office/management-units-tab/management-units-contract.spec.ts` (17 tests total):

- **Canonical Schema Validation (4 tests)**: Schema compilation, 100% fixture validation, Thanlyin Unit 01 validation, Twantay Unit 01 validation.
- **Field Classification (4 tests)**: Verification of deferred classifications (`isSimulated`, overlays, detailed thresholds, RFC 7807).
- **Historical Drift Snapshot (5 tests)**: OLD / DEPRECATED snapshot against superseded PR #140 proposal.
- **Consumer Safety (4 tests)**: Zero HTTP calls in live/demo, Head Office isolation, synthetic status enforcement.

**Historical Local Test Results (prior head; not current-head certification):**

- `management-units` Jest suites: **26/26 PASS**
- Full Web test suite: **37/37 suites, 404/404 tests PASS**
- ESLint: 0 errors. Prettier: clean. MPL-2.0 headers: valid.

---

## 9. Open Decisions for Counterpart Owners

| ID     | Open Decision                                                                                    | Owner              | Target Resolution                        |
| :----- | :----------------------------------------------------------------------------------------------- | :----------------- | :--------------------------------------- |
| **D1** | Formally approve reconciled canonical schema v1.1.0 (`management-unit-web-contract.schema.json`) | **AG1 + GPT01**    | Merge PR #146 into `main`                |
| **D2** | Determine whether an active HTTP daemon/service will serve Unit REST endpoints for M01           | **AG1 + Owner**    | Define runtime daemon architecture       |
| **D3** | APISIX route definition and gateway error semantics                                              | **GPTInfra (#60)** | Only after D2 provides a real listener   |
| **D4** | Wire resolver and enable `/api/v1` proxy context (numeric ID fallback refactored)                | **AG2 (#65)**      | Only after D1–D3 and #124 HOLD is lifted |
| **D5** | Independent read-only acceptance verification                                                    | **AG3 (#53)**      | Full-stack verification                  |

**Enforcement Policy**: PR #65 remains **OPEN**; strictly **zero deployment executed, zero merge performed**.

## 10. Current repair and AG3 acceptance boundary

Local repair validation: 42 suites / 438 unit tests passed; the targeted consumer suite passed 17/17; production build passed. Full lint initially exposed inherited formatting problems beyond the original report; repository Prettier was applied and lint rerun. Final hosted status is recorded against the pushed head in PR #65, never inferred from these local results.

Prepared from accepted fork dev `be73738454a924cd9f242addf7888cad354e78a0`, repairing PR head `5a3ae57f25b82e4a7904183aaa12a2a8c7e0fec5`. Final commit is identified by this report's enclosing Git revision and the PR evidence; a report cannot embed its own Git object hash.

Governance reference: [Program PR #143 at 7401515a](https://github.com/nandahtoon/MicroOps-360-Fineract-Org/blob/7401515a82cd0f6828b6090906990376cc7139bd/docs/architecture/project-wide-agent-delivery-alignment-proposal.md). Proposal status is preserved. Unit runtime HOLD remains effective. No repeated probes of known missing Unit routes were performed for this repair.

Resolved the actual base conflict by retaining both configurable MifosOps `brandName` and default-off `demoMode`. Preserved accepted dev's general proxy and environment defaults rather than making ordinary upstream/demo behavior local-only. The existing `start:local` profile is not certified as tenant-isolated: selector/storage pinning and invalid-target rejection still require separate review. Do not use it as proof of endpoint or tenant isolation.

The copied schema now matches AG1 draft PR #146 at `bbef87e9107efe7aa10851e385624cd0497a4e9f` after JSON parsing; formatting may differ. The prior copy differed in descriptive provenance only. Required fields in section 5 mean required by this provisional schema, not accepted runtime authority. Existing reports of 404 and browser behavior remain historical, environment-specific evidence.

AG3 handoff: independently review the exact final head, report formatting, MifosOps/default-off demo conflict resolution, positive schema tests and deferred fields, live empty versus explicit synthetic preview, and Office resolver/permission behavior. No Unit API, Unit RBAC, geography integration, vertical-slice PASS, merge, rollout, or business-data mutation is authorized. Links: [AG1 #144](https://github.com/nandahtoon/MicroOps-360-Fineract-Org/issues/144), [Program #127](https://github.com/nandahtoon/MicroOps-360-Fineract-Org/issues/127), [Infra #60](https://github.com/nandahtoon/MicroOps-Infra/issues/60), [AG3 #53](https://github.com/nandahtoon/MicroOps-Infra/issues/53).
