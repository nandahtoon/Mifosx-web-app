# MifosX Enterprise Dashboard Enhancement Docs

This folder documents the dashboard modernization work for MifosX Web App.

## Scope

MifosX Web App only.

## Sprint Docs

### Sprint 1: Dashboard Foundation

- `SPRINT-1-DASHBOARD.md`
- `SPRINT-1-COMPLETION.md`
- `SPRINT-1-REFACTOR-LOG.md`
- `SPRINT-1-DEEP-REFACTOR-CHECKPOINT.md`
- `CODEBASE-ANALYSIS.md`
- `DASHBOARD-COMPONENT-CATALOG.md`
- `API-MAPPING-DASHBOARD.md`
- `ROUTE-PATCH.md`

### Sprint 2: Resilience and Navigation

- `SPRINT-2-DASHBOARD-RESILIENCE.md`
- `SPRINT-2-COMPLETION.md`
- `SPRINT-2-REFACTOR-LOG.md`
- `SPRINT-2-DEEP-REFACTOR-CHECKPOINT.md`
- `NAVIGATION-DASHBOARD.md`

### Sprint 3: API Foundation

- `SPRINT-3-API-FOUNDATION.md`
- `SPRINT-3-COMPLETION.md`
- `SPRINT-3-REFACTOR-LOG.md`
- `SPRINT-3-DEEP-REFACTOR-CHECKPOINT.md`

### Sprint 4: Total Portfolio Seam and CI

- `SPRINT-4-TOTAL-PORTFOLIO.md`
- `SPRINT-4-COMPLETION.md`

### Sprint 5: Mapper and Fallback

- `SPRINT-5-MAPPER-FALLBACK.md`
- `SPRINT-5-COMPLETION.md`

### Sprint 6: Final Documentation and Review

- `SPRINT-6-ROLLUP.md`
- `QUALITY-GATES.md`
- `FINAL-REFACTOR-REVIEW.md`

## Pull Request Chain

```text
PR #1 Sprint 1 -> Dashboard foundation
PR #2 Sprint 2 -> State and navigation readiness
PR #3 Sprint 3 -> API foundation
PR #4 Sprint 4 -> CI and Total Portfolio seam
PR #5 Sprint 5 -> Mapper and fallback
PR #6 Sprint 6 -> Documentation rollup
```

## Quality Gates

Run or verify:

```bash
npm run lint
npm run test
npm run build
```

GitHub Actions runs the same quality checks automatically after Sprint 4.
