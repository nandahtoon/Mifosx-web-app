# Google Antigravity Workflow Alignment

## Purpose

This guide helps Google Antigravity and other AI development agents work in this repository without drifting away from the approved product scope.

## Repository Role

This repository is the MifosX Commercial Operations Portal for Apache Fineract operations.

It should not become the full Universal Financial Operations Platform.

## Required Reading Order

Before generating or changing code, read:

1. `AGENTS.md`
2. `docs/PROJECT_SCOPE.md`
3. `docs/ARCHITECTURE_PRINCIPLES.md`
4. `docs/AI_DEVELOPMENT_WORKFLOW.md`
5. `docs/DEFINITION_OF_DONE.md`
6. `docs/FINERACT_EXTENSION_GUIDE.md`
7. `.github/PULL_REQUEST_TEMPLATE.md`

For RiskOps work, also read:

- `docs/RISKOPS_LITE_ARCHITECTURE.md`

For AI Copilot work, also read:

- `docs/AI_COPILOT_ARCHITECTURE.md`

## Agent Task Flow

Use this sequence:

```text
Read scope
  -> Identify existing module
  -> Propose smallest safe change
  -> Confirm affected routes and APIs
  -> Implement on feature branch
  -> Run checks
  -> Update documentation
  -> Prepare PR with human approval checklist
```

## Scope Control

Antigravity should implement only MCOP features inside this repo:

- Dashboard.
- Client 360.
- Loan 360.
- Collection workspace.
- RiskOps Lite.
- Read-only AI Copilot UI.
- Tenant branding.
- Feature flag UI.
- Documentation and tests.

Move these topics to a future separate repository unless explicitly approved:

- Universal multi-CBS adapters.
- Universal business model.
- Universal accounting connector framework.
- Payment hub.
- Plugin marketplace.
- Full integration hub.

## PR Discipline

Each PR must be small and focused.

Do not mix:

- UI redesign.
- dependency upgrade.
- refactoring.
- API behavior change.
- formatting-only cleanup.

## Human Checkpoint

Stop and request human confirmation when the task affects:

- Financial workflow.
- Permission behavior.
- Authentication behavior.
- Tenant behavior.
- Accounting behavior.
- Large route or module structure.
- New dependency.

## Completion Report

At the end of each task, Antigravity should report:

- Files changed.
- Routes affected.
- APIs or reports used.
- Tests run.
- Known limitations.
- Screenshots for UI changes.
- Human approval items still pending.
