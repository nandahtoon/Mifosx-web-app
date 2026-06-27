# Human Approval Checklist

## Purpose

Human approval keeps AI-assisted development safe for business, architecture, UI, and release decisions.

## Gate 1: Requirement Approval

Approve only if the business problem, target users, acceptance criteria, and out-of-scope items are clear.

## Gate 2: Architecture Approval

Approve only if the change fits project scope, reuses existing patterns, preserves Fineract behavior, and has a clear rollback path.

## Gate 3: Business Logic Approval

Approve only if loan, savings, accounting, client, group, collection, and maker-checker behaviors remain correct.

## Gate 4: UI/UX Approval

Approve only if users can complete the workflow efficiently and loading, empty, error, and warning states are understandable.

## Gate 5: Merge Approval

Approve only if CI checks pass or exceptions are documented, documentation is updated, and no unrelated changes are included.

## Gate 6: Release Approval

Approve only if smoke test path, rollback path, deployment configuration, and support impact are understood.
