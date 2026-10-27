# Dependency remediation guards

## SockJS UUID compatibility override

SockJS 0.3.24 pins UUID 8 through its dependency range. Its connection constructor uses only CommonJS `require('uuid').v4()` without options or buffers. The scoped `sockjs.uuid` override selects UUID 11.1.1, which preserves that API. This is an intentional transitive major-version change, not an Angular, Jest or SockJS major upgrade.

The real transport regression in `scripts/sockjs-transport.test.cjs` opens two loopback WebSocket connections, verifies unique v4 IDs, echoes synthetic messages and closes the connections. It passes with the original UUID 8 and the overridden UUID 11; the build workflow runs it after the existing Jest suite. No backend or business data is involved.

Remove this override when the supported SockJS dependency chain resolves an unaffected UUID release without it. Re-run a clean locked install, the transport regression, lint, production build, browser E2E and the full dependency audit before removing it. UUID 11 CommonJS usage is documented in the [upstream v11.1.1 README](https://github.com/uuidjs/uuid/blob/v11.1.1/README.md).

## Remaining ExcelJS browser-bundle review

ExcelJS 4.4.0 still resolves UUID 8.3.2. npm reports the UUID buffer-bounds advisory [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq), affecting v3/v5/v6 when a buffer is supplied, and propagates that finding to ExcelJS.

The inspected ExcelJS source uses UUID v4 for conditional-formatting IDs. That observation alone does not close the advisory or certify exploitability. The application imports `exceljs` for report exports, and the package's browser entry is the prebuilt `dist/exceljs.min.js`. A package-manager override changes resolved modules; it does not rewrite that prebuilt browser artifact.

Keep the ExcelJS/UUID finding open until a reviewed upstream browser bundle or source-bundling integration is verified. Acceptance must include browser export behavior, workbook data/styles/formulas and conditional-formatting round trips, the actual generated bundle and dependency audit. Do not treat a Node-only dependency override or an audit-suggested ExcelJS downgrade as proof that the shipped browser artifact is remediated.

No risk acceptance, application-library migration or financial behavior change is authorized by this document. Audit package counts are not an exploitability assessment or a production-readiness certificate.
