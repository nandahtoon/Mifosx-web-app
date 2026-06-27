# AI Development Workflow

## Purpose

AI-assisted development must remain safe, reviewable, and commercially useful. The goal is not full automation. The goal is high-productivity AI execution with human approval at key decision points.

## Workflow

```text
Business Request
  -> Chief Engineer Analysis
  -> Human Requirement Approval
  -> AI Development Plan
  -> Human Architecture Approval
  -> Small Feature Branch
  -> Code Change
  -> Lint / Test / Build
  -> AI Self Review
  -> Human Review
  -> Merge
  -> Post-Merge Documentation
```

## Human Approval Gates

### Gate 1: Requirement Approval

Approve business purpose, user value, scope, acceptance criteria, and out-of-scope items.

### Gate 2: Architecture Approval

Approve module location, API approach, service reuse, Fineract impact, permission impact, and rollback path.

### Gate 3: Merge Approval

Approve business correctness, architecture fit, UI/UX, test/build result, and documentation.

## AI Developer Rules

Before coding, AI must answer:

1. What business problem is being solved?
2. Which existing module already supports part of this?
3. Which Fineract API/report endpoint will be used?
4. What existing workflow could break?
5. What is the smallest safe PR?

During coding, AI must reuse existing patterns, keep changes small, avoid unrelated formatting, avoid dead code, avoid tenant-specific branches, and preserve tenant/auth behavior.

After coding, AI must report files changed, routes affected, APIs used, tests run, known limitations, and screenshots for UI changes.

## Required Checks

```bash
npm ci
npm run lint
npm run test:ci
npm run build:prod
```

If a command cannot be run, the PR must state why.
