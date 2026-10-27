# Opt-in local MicroOps Web

Run `npm run start:microops-local`, then open `http://localhost:4200`. The existing local APISIX/Fineract stack must already be available; this command does not manage Docker or provision data.

Check port ownership before starting. If `localhost` reaches a different packaged Web, do not authenticate there as source-build evidence or stop its runtime.

- **Historical observation (2026-10-14)**: During earlier testing on 2026-10-14, Docker bound to IPv4 `127.0.0.1:4200` while Node bound to IPv6 `[::1]:4200`, causing dual-listener collision.
- **Historical host snapshot (2026-10-15 14:00 UTC)**: At that observation, port 4200 was reported free across all host interfaces (`Get-NetTCPConnection -LocalPort 4200` returned 0 active listeners, consistent with AG3 Infra #53's report at 2026-10-14 21:55 UTC). This dated evidence does not establish current port ownership or availability. **A free port is NOT a running Web server**: verify current ownership before starting `npm run start:microops-local` in the local DEV lane.

Browser requests use the UI origin and `/fineract-provider/api/v1`; the Angular proxy preserves that path and forwards only `/fineract-provider/**` to `http://127.0.0.1:9080`. For an explicitly configured lab gateway port, set `APISIX_HTTP_PORT` to the same numeric port used by Infra before starting the command. Remote hosts, TLS overrides and alternate tenants are not options in this profile.

The profile substitutes a separate runtime asset for `assets/env.js`. It fixes tenant `default`, disables endpoint/tenant selectors and optional integrations, and keeps DEMO off. Disabled selectors use deployment configuration rather than stale browser server/tenant preferences. This is configuration enforcement, not a replacement for Fineract authorization. Branding continues through the existing configurable appearance system and MifosOps default.

`npm start`, the legacy localhost profile and production asset configuration remain separate. Stop the local command before changing branches. Do not reuse a prior authenticated browser session as login evidence; use the supported synthetic login flow. No credential values belong in this document or runtime asset.

Acceptance requires actual browser login, native Office/Clients reads and refresh/logout through the local proxy, sanitized request path/tenant evidence, error-state checks and independent AG3 verification. A profile test or successful build does not establish backend availability, packaged-image provenance, BTK seed presence or Oracle staging readiness. Unit runtime remains HOLD; do not probe missing Unit endpoints.

Contract: [Infra #54](https://github.com/nandahtoon/MicroOps-Infra/issues/54). Runtime ownership belongs to GPTInfra; Web source/profile ownership belongs to AG2. Roll back by stopping this opt-in command and selecting the previously approved profile; source rollback requires a reviewed revert.

## Historical local evidence and host reconciliation, 2026-10-15

The source-profile report at that date recorded port 4200 free across all host interfaces (`Get-NetTCPConnection -LocalPort 4200` returned no active listeners), reconciling the prior IPv4 Docker container observation with AG3 Infra #53's report (port 4200 free at 2026-10-14 21:55 UTC). It also recorded port 9080 listening on `127.0.0.1:9080` (APISIX 3.18.0 gateway returning HTTP 200 `{"status":"UP"}` on actuator health). These are historical observations, not current live probes. A free port alone does not constitute a running server.

Negative transport test coverage: added 4 scoped regression test cases in `src/app/settings/local-profile.spec.ts` covering synthetic/mocked transport scenarios:

1. `401 Unauthorized`: asserts graceful handling and authentication alert trigger (`errors.error.auth.type`).
2. `403 Forbidden`: asserts graceful handling and unauthorized alert trigger (`errors.error.unauthorized.type`).
3. `Status 0 (unreachable / network offline / connection refused)`: asserts graceful handling without uncaught exception (`errors.error.unknown.type`).
4. `504 Gateway Timeout`: asserts graceful generic handling without uncaught exception (`errors.error.unknown.type`; `ErrorHandlerInterceptor` does not define a timeout-specific UI branch, handling 504 through its generic fallback).

All 4 negative cases are strictly classified as **mocked TEST evidence** (`HttpClientTestingController`), not live host proof or actual browser/backend acceptance. No credentials or business data were modified, and no authentication injection or TLS bypass was used.

The historical source-profile report recorded 40 suites / 418 tests passed, full lint, production build, and MPL-2.0 header verification. These results apply to that report's source head; they are not current-head validation.

These are AG2 source-profile results, not independent AG3 acceptance. Packaged image provenance, canonical host routing, unauthorized/offline live scenarios, and Oracle staging remain separate gates. Unit runtime remains HOLD. Exact commit and hosted CI results belong in the PR description, not inferred from an earlier build stamp.
