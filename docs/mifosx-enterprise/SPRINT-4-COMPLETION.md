# Sprint 4 Completion Checklist

Sprint: Total Portfolio KPI and CI Automation
Status: Implementation complete; pending GitHub Actions run and human approval of real report config.

## Completed

- [x] CI workflow added
- [x] Automated commands configured
- [x] Dashboard report config model added
- [x] DashboardReportConfigService added
- [x] Total Portfolio KPI fallback seam added
- [x] Facade tests updated
- [x] Sprint 4 plan documented

## Automated Commands

GitHub Actions will run:

```bash
npm ci
npm run lint
npm run test:ci
npm run build
```

## Human Review Required

- [ ] Approve workflow command set.
- [ ] Confirm first real report name for Total Portfolio.
- [ ] Confirm report params.
- [ ] Confirm fallback behavior.

## Recommended Sprint 5

Add report response mapper and catchError fallback, but keep report disabled until report name is approved.
