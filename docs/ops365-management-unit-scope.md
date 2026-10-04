# OPS-365 Management Unit Scope Model

Status: project architecture alignment for MicroOps 360 Web.

## Canonical meanings

- **Apache Fineract Office / Branch** is the current operational organization authority and coarse access scope.
- **Fineract Role / Permission** defines what an authenticated user may do.
- **Fineract Staff** is the authoritative personnel reference.
- **M01 Management Unit** is an operational span-of-control, staffing assignment, supervision, workload and capacity context.
- **Fineract Center / Group** remains the microfinance customer/meeting structure.

A Management Unit is **not** an RBAC group, Fineract Role, Office, Center, Group, booking entity, financial owner, or accounting dimension by default.

## Web authorization rule

The Angular application must never claim or implement Unit-level authorization through client-side filtering alone.

For the current baseline:

- Fineract RBAC + Office scope remains the enforceable access boundary.
- Unit assignment is operational/contextual data owned by the accepted M01 contract.
- UI may present Unit membership, workload, capacity and supervision context only from an approved source.
- A UI-supplied `unitKey` is never authorization evidence.

If a future screen requires "Unit Manager may access only Unit 01", an approved server-side boundary must validate:

1. authenticated User;
2. Fineract Role/Permission;
3. Fineract Office/Branch scope;
4. linked Staff identity where required;
5. active effective-dated Unit assignment.

Missing, ambiguous or stale Unit scope must fail closed. The browser must not receive broader data and merely hide out-of-scope rows.

## Administration UX direction

MicroOps 360 Web may provide a workflow-first Organization Administration experience that improves on stock menu-first Mifos X while preserving Fineract authority:

- Offices
- Staff
- Management Units
- Unit Manager / Loan Officer assignments
- Capacity monitoring
- Capacity cases
- Assignment history

The UI is presentation/orchestration only. It must not create a duplicate Office, Staff, User, Role or Unit runtime master.

## Integration boundary

Consume the accepted M01 Unit/assignment contract through an approved integration path. Do not read Git repository files as runtime data and do not invent a new backend/service as part of UI work.

Until a server-side Unit authorization boundary is accepted and implemented, Unit-aware screens must be described as operational context, not a proven Unit-level security boundary.
