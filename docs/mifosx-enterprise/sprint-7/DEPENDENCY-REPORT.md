# Sprint 7.1 Dependency Report

Scope: static dependency audit from `package.json` only.

## Stack Snapshot

- Angular 20.3.x
- Angular Material/CDK 20.x
- TypeScript 5.9.x
- RxJS 7.8.x
- Jest
- Playwright
- ESLint
- Stylelint
- Prettier
- HTMLHint

## Findings

### DEP-001: CI depends on several quality tools

Severity: Medium

`npm run lint` runs:

```text
eslint .
stylelint "src/**/*.scss"
prettier . --check
htmlhint "src" --config .htmlhintrc
```

Risk:

- A missing or weak config in any one tool can block all PRs.

Recommendation:

- Keep explicit config files for ESLint, Stylelint, Prettier, and HTMLHint.
- Add CI evidence to every PR.

### DEP-002: Multiple heavy visualization/document libraries exist

Severity: Low

Dependencies include Chart.js, D3, jsPDF, html2canvas, ExcelJS, Tinymce, Lottie, and ngx-graph.

Risk:

- Future feature work can accidentally increase bundle size.

Recommendation:

- Do not add new chart/export/editor libraries without architecture approval.
- Prefer existing dependencies where already justified.

### DEP-003: Audit requires local command execution

Severity: Medium

This connector cannot run local npm commands directly.

Required local/CI commands:

```bash
npm ci
npm audit
npm run lint
npm run test:ci
npm run build
```

Recommendation:

- Treat this document as static audit.
- Use GitHub Actions logs as execution evidence.

## Next Slice

Run dependency and lint checks in CI, then create targeted fixes only for concrete failures.
