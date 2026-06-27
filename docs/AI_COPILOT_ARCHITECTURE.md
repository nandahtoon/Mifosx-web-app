# AI Copilot Architecture

## Purpose

AI Copilot is a read-only assistant for the MifosX Commercial Operations Portal.

It explains reports, risk signals, workflows, and navigation. It must not perform financial actions.

## In Scope

- Report explanation.
- Risk signal explanation.
- Natural language search.
- Contextual help.
- Workflow guidance.
- Documentation assistance.

## Out of Scope

- Approving maker-checker tasks.
- Posting transactions.
- Reversing transactions.
- Disbursing loans.
- Editing client data.
- Editing accounting data.
- Autonomous lending decisions.

## Principles

1. Read-only first.
2. Context-aware.
3. Source-traceable where practical.
4. Permission-aware.
5. No secret exposure.
6. Explainable risk.

## Human Approval Required For

- Any write action.
- Any external AI provider integration.
- Any use of client-sensitive data.
- Any change to auth/session behavior.
- Any automated recommendation that could affect credit or accounting decisions.

## MVP Definition

The first Copilot MVP should be feature-flagged, read-only, explain current dashboard/report/risk signal, provide navigation help, and fail safely if unavailable.
