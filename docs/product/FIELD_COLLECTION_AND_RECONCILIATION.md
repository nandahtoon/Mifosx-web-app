# MicroOps 360 Field Collection and Reconciliation Scope

Tracking: [`nandahtoon/RCC#272`](https://github.com/nandahtoon/RCC/issues/272)

## Purpose

This document preserves accepted transactional and branch-operational guidance from the frozen `nandahtoon/RiskOps` documentation in the canonical MicroOps 360 Web product line.

It is a **product and control specification**, not evidence that every workflow or screen is already implemented. Institution-specific authority, policy, tolerance, accounting treatment, receipt rules, and operating procedures require explicit approval before implementation or production use.

## Immutable sources

| Source | Commit | Accepted material |
|---|---|---|
| `nandahtoon/RiskOps/docs/field-officer-app.md` | `78cd1ed654202274fd990a726130a1f09bf65d52` | Field route, customer, collection, receipt, offline-command, evidence, and day-end screen requirements |
| `nandahtoon/RiskOps/docs/reconciliation-workflow.md` | `4a99f4d8d947468933bcf0db5e5bae05cf663cd2` | Morning control, cashier verification, variance, audit-event, risk-flag, and status proposals |
| `nandahtoon/RiskOps/docs/product-scope.md` | `6828e52505bdcd486403e535e9a222ddbdef0b8b` | Traceability, maker/checker, audit, idempotency, and explainability constraints |
| `nandahtoon/RiskOps/docs/architecture.md` | `6d0605f090b19bddb1578333d77344dd5bb37034` | API/adaptor boundaries, offline command identity, server-side controls, and audit principles |
| `nandahtoon/RiskOps/docs/backlog.md` | `f468f140bbdf387447af8eb244df3d7b5a25134e` | Candidate screens and work areas, reclassified below |

The original files mixed MicroOps transaction authority with FinSentry risk intelligence. This specification separates those responsibilities.

## Responsibility boundary

### MicroOps owns the product workflow

- route, task, and collection-operating workflows;
- repayment or savings command capture and submission through verified CBS contracts;
- cash/receipt custody and assignment workflows when approved by institution policy;
- offline financial-command identity, queue state, retry, duplicate prevention, and conflict handling;
- officer declaration, cashier verification, expected-versus-actual comparison, and operating day close when approved and implemented;
- user experience for corrections, cancellations, reversals, approvals, and final transactional status;
- user-visible CBS posting and reconciliation status.

MicroOps may implement these responsibilities only through verified Apache Fineract contracts and approved application services. Apache Fineract is authoritative only for the CBS functions, posting states, references, balances, schedules, reversals, and other records that its verified contracts actually provide. This document does not claim that Fineract owns or already supports route planning, offline queues, physical custody, cashier workflow, reconciliation, or operating-day close.

### FinSentry owns

- read-oriented detection of reconciliation or collection-integrity breaks;
- risk alerts, explanations, prioritization, investigations, evidence-linked cases, and follow-up;
- officer/branch/customer risk patterns derived from governed source facts;
- executive risk oversight.

FinSentry must not post or reverse financial transactions, control cash custody, perform authoritative cashier balancing, or close the operational day.

## Proposed daily workflow

The following flow is a candidate product model. It is not effective institutional policy until approved and mapped to verified Fineract capabilities.

### 1. Session and route preparation

Candidate controls:

- authenticate the user and verify permitted office/branch scope;
- show device, application, and last-sync state when a mobile client is used;
- assign or display the approved route and customer worklist;
- display due, overdue, promise-to-pay, and exception priorities;
- record the authorized session baseline and responsible users;
- download only the data required for approved offline work.

Cash float, receipt-book custody, and physical instrument assignments are optional institution-controlled modules. Their presence, accounting meaning, and authority must not be invented by the application.

### 2. Customer and collection work

Candidate screens and actions:

- route or worklist;
- customer and account context;
- approved repayment or savings command entry;
- amount, method, account, and receipt confirmation;
- visit outcome and promise-to-pay capture;
- exception, hardship, suspected fraud, or data-quality referral;
- clear pending, synchronized, rejected, conflicted, and manual-review status.

Every financial command must use the authoritative Fineract contract and must fail visibly when the CBS rejects, cannot process, or cannot confirm it.

### 3. Command identity and duplicate control

Every offline-capable financial command should carry a stable identity and evidence appropriate to the approved client architecture, including:

- idempotency or command key;
- user/officer identity;
- office/branch context;
- device or client-instance identity when approved;
- local creation time and ordered local sequence;
- target customer/account and command type;
- sync attempt, acceptance, rejection, conflict, and authoritative CBS reference state.

A locally saved command is not a posted transaction. The interface must distinguish local capture, sent, server accepted, CBS posted, rejected, conflicted, reversed, and manually reviewed states.

### 4. Receipt controls

Supported receipt behavior depends on institution policy and verified backend capabilities. Candidate controls include:

- digital receipt reference generated only from an authoritative CBS-posted transaction state and reference confirmed through a verified contract;
- controlled manual-receipt reference capture when explicitly allowed;
- duplicate and sequence-gap detection;
- cancelled, damaged, skipped, or replaced receipt explanation;
- linkage between the receipt, command, customer/account, user, and authoritative CBS reference;
- audit evidence for reprint, cancellation, correction, or reversal.

The UI must not present a locally generated receipt, transport acknowledgement, middleware acceptance, or server-accepted command as proof of posting. Proof of posting requires the authoritative CBS-posted state and transaction reference defined by the verified Fineract contract.

### 5. Officer declaration and cashier verification

Where branch cash reconciliation applies, MicroOps may support:

- officer pre-close summary;
- cash and non-cash collection totals sourced from authoritative or clearly labelled pending states;
- pending, rejected, reversed, and unconfirmed command disclosure;
- physical cash declaration;
- cashier receipt and independent verification;
- receipt/instrument status;
- variance preview and explanation;
- supervisor or authorized reviewer escalation;
- final operational close when all required controls are satisfied.

The application must not silently combine unconfirmed offline entries with posted CBS transactions as though both are settled facts.

## Proposed reconciliation calculation boundary

A configurable reconciliation model may compare approved components such as opening custody, authoritative cash collections, approved adjustments, declared cash, and cashier-received cash.

No fixed formula in this document is authoritative. Before implementation, product, operations, finance, accounting, internal audit, and security owners must approve:

- which components are included;
- source system and posting state for each component;
- rounding and currency behavior;
- treatment of pending, rejected, reversed, cancelled, non-cash, and backdated transactions;
- variance tolerance and escalation;
- maker/checker requirements;
- close/reopen authority and audit evidence.

## Proposed states

A future implementation may use a controlled state machine such as:

- Not Started
- Prepared
- In Field
- Officer Declaration Submitted
- Cashier Verification Pending
- Matched
- Variance Review Required
- Approved for Close
- Closed
- Reopened by Authorized Approval

Exact state names and transitions require a reviewed domain contract. A closed session must not be reopened or mutated through UI-only logic.

## Required controls

- server-side authentication, authorization, and office/branch scope;
- least privilege and separation of incompatible duties;
- maker/checker for approved sensitive actions;
- explicit reason and evidence for overrides, corrections, reversals, and reopening;
- immutable or append-only audit evidence appropriate to the canonical architecture;
- no browser-held CBS credentials;
- idempotent command handling and visible duplicate/conflict outcomes;
- clear distinction among local, pending, confirmed, derived, and simulated information;
- data masking and minimum necessary customer data;
- accessibility and outdoor readability for field workflows;
- no AI-generated transaction posting, balancing decision, or silent override.

## Candidate risk and exception signals

MicroOps may expose source facts and operational exceptions such as:

- duplicate or skipped receipt reference;
- unconfirmed collection command;
- customer/account mismatch;
- delayed or failed posting;
- repeated correction or reversal;
- late declaration or close;
- unexplained variance;
- repeated authorized override;
- location/time anomaly when policy and lawful data collection permit it.

FinSentry may consume governed events or read models to detect and investigate patterns, but it must not become the operational transaction authority.

## Candidate screens

- Today / route worklist
- Customer and account context
- Collection or savings command entry
- Promise-to-pay and visit outcome
- Pending/offline command queue
- Officer declaration
- Cashier verification
- Variance review
- Supervisor approval queue
- Branch reconciliation status
- Audit and exception history

These are product requirements only. Existing Angular routes, Fineract APIs, permissions, reports, and tests must be inspected before claiming implementation coverage.

## Design direction

For field and branch operating screens:

- use Angular Material and the repository theme system;
- use PalmPilot-style operational clarity as design DNA, not visual imitation;
- maintain accessible touch targets, typography, focus behavior, and contrast;
- use compact information density without hiding status or error meaning;
- reserve semantic color for risk, urgency, exception, action, and sync/posting state;
- provide clear light, dark, responsive, and outdoor-readable behavior where supported;
- never trade transaction clarity for decorative presentation.

## Implementation gate

Before code work begins:

1. Verify relevant Apache Fineract APIs, permissions, idempotency behavior, transaction states, reversals, and receipt/report capabilities.
2. Obtain approved institution workflow, authority, reconciliation, finance/accounting, audit, security, and data-retention requirements.
3. Define the canonical state machine, command contracts, source-of-truth rules, failure behavior, and rollback.
4. Add characterization tests for existing behavior before material refactoring.
5. Deliver one focused reviewed PR per capability with build, lint, unit, integration, and E2E evidence appropriate to the change.

## Explicit exclusions

This document does not authorize:

- autonomous credit or transaction decisions;
- direct ledger/accounting behavior outside verified Fineract contracts;
- silent simulation fallback;
- hard-coded institution tolerance or approval policy;
- GPS, signature, photo, or device surveillance without lawful approved policy;
- a React rewrite, Odoo scope, or a second MicroOps implementation;
- FinSentry transaction mutation.