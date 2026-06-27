# Sprint 1: MifosX Modern Rich Dashboard

Scope: MifosX Web App only.

Branch: feature/dashboard-modernization
Base: dev

## Repo Boundary

This repository contains the MifosX Web App product work.

AiSFT is used only as the Human-in-the-loop AI Software Factory method.

## Confirmed Stack

- Angular 20
- Angular Material 20
- TypeScript
- SCSS
- Chart.js already available
- D3 already available
- Jest
- Playwright

No React rewrite.
No Odoo scope.
No new dashboard chart dependency unless approved.

## Current App Observation

The app uses lazy-loaded Angular modules in `src/app/app-routing.module.ts`.

Existing top-level routes include clients, collections, accounting, reports, search, notifications, settings, system, and checker-inbox-and-tasks.

A dedicated dashboard route is not currently present in the top-level route list, so the dashboard enhancement should be introduced as an isolated feature module.

## Sprint Goal

Create the implementation foundation for a modern operational dashboard.

The dashboard must help MFI users understand portfolio health, collection status, approvals, alerts, and daily tasks quickly.

## Dashboard Sections

1. Dashboard header
2. KPI card row
3. Portfolio trend
4. Portfolio by product
5. Alerts panel
6. Today activities
7. Loan growth
8. PAR summary
9. My tasks
10. Recent loans
11. Top branches
12. Quick actions

## Human Approval Gates

| Gate | Review Item | Decision |
|---|---|---|
| H1 | Dashboard route and layout | Approve or revise |
| H2 | KPI list and labels | Approve or revise |
| H3 | Component structure | Approve or revise |
| H4 | First Angular shell | Approve or request changes |
| H5 | Visual UAT | Approve or revise |

## First PR Scope

The first PR should only add foundation pieces:

- dashboard route/module skeleton
- dashboard shell layout
- design tokens
- component catalog docs
- mock data isolated for development

Do not connect production APIs in the first PR.

## Engineering Rules

- Keep changes small.
- Keep dashboard isolated.
- Do not modify unrelated modules.
- Do not add Odoo logic.
- Do not add React.
- Use existing Angular Material and existing dependencies.
- Add loading, empty, and error states.
- Respect future permission handling.
