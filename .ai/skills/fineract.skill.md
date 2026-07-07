# Fineract Skill

## Purpose

Use this skill when working with Apache Fineract data, reports, permissions, or workflows.

## Rules

- Fineract is the system of record.
- Use existing APIs or reports first.
- Preserve tenant header behavior.
- Preserve authentication behavior.
- Preserve permission behavior.
- Do not change financial workflow behavior without approval.

## High Review Areas

- Loan workflow.
- Repayment workflow.
- Savings workflow.
- Accounting workflow.
- Client data update.
- Maker-checker workflow.

## Checklist

- [ ] Endpoint or report identified.
- [ ] Read/write behavior identified.
- [ ] Permission impact checked.
- [ ] Tenant behavior preserved.
- [ ] Existing workflow impact considered.
