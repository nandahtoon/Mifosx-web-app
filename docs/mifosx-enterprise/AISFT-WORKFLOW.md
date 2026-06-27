# AiSFT Human-in-the-Loop Workflow

This repository is the MifosX Web App product repository.

AiSFT is the development method, not the product code location.

## Workflow

Requirement -> AI analysis -> Human approval -> UI and technical proposal -> Human approval -> Small code change -> Build and tests -> Pull request -> Human review -> Merge.

## Rules

- Human approves scope before coding.
- Human approves UX before coding.
- AI changes must be small and reviewable.
- One PR should have one clear purpose.
- Do not mix unrelated modules.
- Do not add React.
- Do not add Odoo.
- Do not change Apache Fineract API contracts without approval.

## Dashboard Sprint Review Points

1. Approve dashboard route name.
2. Approve dashboard shell layout.
3. Approve KPI cards.
4. Approve chart panels.
5. Approve alerts and task behavior.
6. Approve final visual UAT.
