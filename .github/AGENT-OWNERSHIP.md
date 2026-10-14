# MicroOps Agent Ownership

This file defines the active agent lanes for this repository.

## Antigravity 2 — Web Application Owner

Primary repository:

`nandahtoon/Mifosx-web-app`

Antigravity 2 owns the Web App end-to-end:

- upstream `openMF/web-app` synchronization;
- MicroOps Web customizations and refactoring;
- Angular UI/UX;
- Fineract API client integration;
- browser authentication/session behavior;
- Web tests and CI/CD;
- ARM64-compatible Web image build;
- immutable Web image/version evidence;
- Web-side Oracle staging readiness and smoke evidence.

## Antigravity 1 — Fineract / Backend / M01 Integration Owner

Antigravity 1 owns Fineract-side API, backend and M01 integration contracts. Its normal implementation lane is outside this Web repository.

AG1 may execute only expressly delegated, bounded local Infra tasks; delegation does not transfer Infra ownership or Oracle runtime authority.

## GPTInfra — Infrastructure and Runtime Owner

GPTInfra exclusively owns MicroOps-Infra, Docker/Compose, APISIX, OCI/Oracle and runtime/deployment administration. AG2 owns the Web image build and immutable provenance; GPTInfra owns runtime promotion and infrastructure operations. Cross-boundary requirements use GitHub Issues or explicit contracts.

## AG3 — Independent Read-only QA

AG3 verifies source, API, image and host-specific evidence independently. This role does not authorize source edits, runtime changes or business-data writes. Local evidence does not certify Oracle staging.

## AG4 — Source and Migration Preparation

AG4 owns source/migration preparation within its approved scope. Preparation does not authorize migration apply or backend business-data changes.

## GPT1 — Program Governance and Acceptance Gates

GPT1 coordinates program governance, architecture and acceptance gates. Dispatch or CI success alone does not constitute acceptance or lift a runtime HOLD.

These lanes follow [Program #127](https://github.com/nandahtoon/MicroOps-360-Fineract-Org/issues/127), [GPTInfra's role contract in Infra #34](https://github.com/nandahtoon/MicroOps-Infra/issues/34), and [AG3's read-only lane in Infra #53](https://github.com/nandahtoon/MicroOps-Infra/issues/53). [Program PR #143](https://github.com/nandahtoon/MicroOps-360-Fineract-Org/pull/143) tracks consistency corrections as a proposal; it does not replace accepted gates. Keep this file aligned with [AGENTS.md](../AGENTS.md).

## Non-overlap rule

Agents must not implement the same work package or edit the same file concurrently.

Cross-boundary requirements use this handoff contract:

1. exact requirement;
2. owning repository/module;
3. API/config contract;
4. expected success behavior;
5. error/failure behavior;
6. acceptance criteria;
7. evidence required.

No silent cross-repository workaround is allowed.

## Web delivery path

```text
openMF/web-app upstream
        |
        v
controlled sync branch
        |
        v
MicroOps Web customization/refactor
        |
        v
lint + unit + build + E2E + review
        |
        v
ARM64 image
        |
        v
immutable digest/version
        |
        v
handoff to MicroOps-Infra
        |
        v
Oracle staging
```

Production deployment is outside this ownership declaration and requires separate authorization.
