# OPS-365 Fineract-First Web Fast Path

Status: current MicroOps 360 Web architecture direction.

## Goal

Deliver one usable MicroOps operator experience without creating a second general backend.

```text
MicroOps Web
     |
     +---- supported Apache Fineract REST APIs ----> Apache Fineract
     |
     +---- proven specialized gap only ------------> separately governed bounded extension
```

Apache Fineract is the primary application backend and operational system of record.

## Reuse first

For capabilities already supported by Fineract and this Web application, reuse and improve the existing screens/services rather than introducing a MicroOps proxy/master layer.

Current examples already present in the Web codebase include:

- Offices;
- Employees / Staff;
- Users, Roles and Permissions;
- Clients and Client lifecycle;
- Client staff assignment/transfer actions;
- Client Identifiers;
- Documents;
- Family Members;
- Data Tables;
- Office Data Tables;
- Working Days and Holidays;
- supported configuration.

## M01 integration

M01 provides configuration/governance/contracts for Fineract Organization & Access.

Native runtime data remains in Fineract.

Management Unit, effective-dated Unit assignment and capacity semantics are non-native concepts. Their runtime placement remains separately gated. Their existence must not be used to justify a generic MicroOps backend.

Until an accepted server-side Unit-scope mechanism exists:

- Unit views are operational context;
- Fineract Role/Permission + Office remain the enforceable native authorization boundary;
- client-side filtering is never authorization.

## M02 integration

Fineract owns ordinary operational Client CRUD/profile/lifecycle.

The historical M02 v0.2 broad canonical Customer API/synchronization model is not the target architecture. Web should use native Fineract Client capabilities directly for ordinary customer operations.

Only proven specialized identity gaps may later use a narrow external endpoint, for example protected identity processing, duplicate/fraud intelligence, or restricted evidence workflows after separate acceptance.

## UX direction

A better MicroOps experience should be achieved primarily through presentation and workflow composition:

- role-aware navigation;
- workflow-first Administration / Organization;
- clear task states;
- fewer menu hops;
- contextual actions;
- consolidated read views;
- explicit live/error/not-configured state;
- no fake financial/customer values.

A composite screen may combine multiple supported Fineract reads. That does not require a new composite backend.

## Non-negotiable rules

- no duplicate Client, Staff, Office, User/Role or financial master in Angular;
- no raw secrets in browser configuration;
- no browser-only authorization boundary;
- no direct database integration;
- no generic MicroOps backend introduced for convenience;
- proven gaps require explicit source-of-truth and lifecycle decisions before runtime implementation.
