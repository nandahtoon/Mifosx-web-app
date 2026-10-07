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

## Antigravity 1 — Core Platform Owner

Antigravity 1 owns Core Platform / Backend / Infra / Integration.

Its normal implementation lane is outside this Web repository. Backend, Fineract, M01/M02, Infra, Oracle runtime, and module-integration changes are handed across the boundary through GitHub Issues or explicit contracts.

## Non-overlap rule

Antigravity 1 and Antigravity 2 must not implement the same work package or edit the same file concurrently.

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
