# Quality Gates

## Automated Commands

GitHub Actions runs these commands on pull requests and feature/dev branch pushes:

```bash
npm ci
npm run lint
npm run test:ci
npm run build
```

## Local Commands

Developers should run:

```bash
npm run lint
npm run test
npm run build
```

## Gate Meaning

### Lint

Checks:

- TypeScript lint rules
- SCSS style rules
- Prettier formatting
- HTML lint rules

### Test

Checks:

- Dashboard facade contract
- Dashboard API service HTTP param mapping
- Total Portfolio mapper behavior

### Build

Checks:

- Angular production build
- TypeScript compile
- template binding correctness

## Sprint Merge Rule

Do not merge a sprint PR until:

- CI passes
- human review approves the scope
- docs are updated
- no unrelated modules are changed

## Manual Review Checklist

- Dashboard route opens under shell.
- Sidenav Dashboard item navigates to `/dashboard`.
- KPI cards are readable.
- Loading, empty, and error states are acceptable.
- Total Portfolio fallback appears when report is not configured.
- No Odoo or React scope is introduced.
