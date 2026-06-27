# Sprint 7.1 Security Audit

Scope: static security audit only. No code change.

## Findings

### SEC-001: No sanitizer bypass hit from connector search

Severity: Low

Search did not return evidence for `bypassSecurityTrust` usage.

Recommendation:

- Keep this as a recurring audit query.
- If sanitizer bypass is introduced later, require explicit review.

### SEC-002: Storage usage needs dedicated local scan

Severity: Medium

Connector search did not return `localStorage` or `sessionStorage` hits, but full local grep should still be run.

Recommended commands:

```bash
grep -R "localStorage\|sessionStorage" src
```

### SEC-003: Dashboard mock data is non-production safe but must remain clearly marked

Severity: Medium

Dashboard contains mock values in facade.

Risk:

- Operators may misread mock values if exposed in production.

Recommendation:

- Ensure dashboard mock/fallback data is clearly labeled until API integration is complete.
- Reconcile Sprint 2 to 6 fallback/state work into `dev`.

### SEC-004: Permissions are template-driven in sidenav

Severity: Medium

Sidenav uses permission directives directly in markup.

Risk:

- Harder to audit complete permission-to-menu mapping.

Recommendation:

- Later sprint: introduce typed navigation model with explicit permission metadata.
