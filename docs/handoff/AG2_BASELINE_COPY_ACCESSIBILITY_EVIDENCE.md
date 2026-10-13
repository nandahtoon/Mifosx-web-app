# AG2 → AG3: branding baseline correction

Updated: 2026-10-13. Status: implementation and local verification; independent AG3 approval and manual visual approval remain pending. Unit runtime is HOLD. No merge, deployment, backend implementation, or business-data writes were performed.

## Sources and ownership

- Fork base: `be73738454a924cd9f242addf7888cad354e78a0` (`dev`).
- Upstream reference: `51458bd5e9595b7aa5551d76820c4de52c4b0ec4`.
- Program governance PR #143 was read at `7401515a82cd0f6828b6090906990376cc7139bd`; it remains a proposal, not runtime authorization.
- Existing Web PR #65: `a511ded7f98305696dff84b7723d9923461d8810`. Report formatting repaired, latest dev reconciled, provisional schema pinned to AG1 PR #146 `bbef87e9107efe7aa10851e385624cd0497a4e9f`. Unit runtime remains unavailable/held.
- Existing Web PR #64: `d35ea1440686981d0402bd718afa0b16f62a50be`. Existing standards document completed without runtime changes.
- Active PR overlap was checked before editing and rechecked: only #64 and #65 were open. This package owns branding templates/styles, their translation catalog entries, spacing guidance, and token-contract corrections. It does not modify the Office/Unit implementation or the #64 standards file. Shared translation files receive distinct branding keys; integration still needs normal merge review.

## Before and after

| Before                                                                                   | After                                                                                                                                   |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Visible `BLOCKED_BY_BACKEND_CONTRACT` governance language                                | Plain explanation of browser/backend/tenant scope, sign-out retention, shared-account implications, and no cross-device synchronization |
| Literal preset names, Active marker, swatch labels, sample labels and accessibility text | Translation keys for these surfaces; explicit English fallback catalog entries prevent raw-key rendering                                |
| Custom radio-role cards without radio keyboard behavior                                  | Angular Material native buttons with pressed state and native Enter/Space handling                                                      |
| M3 heading, three-layer claim listing A–D, blanket contrast/storage guarantees           | Actual M2 theming, four layers, 8px layout rhythm with existing 4px subgrid, measured/conditional contrast and storage limits           |
| White Active badge text tied to preset primary colors                                    | Existing surface-container and text tokens used for the Active badge                                                                    |

MifosOps remains the configurable deployment default; existing preset identifiers and Mifos X origin patterns are preserved. Reactive Forms, Fineract contracts and financial data-state behavior are unchanged. The appearance preview remains explicitly DEMO DATA.

## Checks and reproducible evidence

- Local full Jest run after GPT1 follow-up: **41 suites, 409 tests passed**, including translated preset accessible names, button pressed-state updates, route-title resolution in all 13 shipped catalogs, and compiled Ocean Material palette contrast regressions.
- Production build: passed. Existing browser-support, bundle/CommonJS and selector warnings are not an accessibility certification.
- Full `npm run lint`: passed after scoped style repairs; ESLint, Stylelint, Prettier and HTMLHint (744 files) completed.
- `npx prettier --write .`, `npm run translations:extract`, explicit-path `headers:add`, `headers:check`, and `git diff --check` were run. The header helper duplicated existing headers; duplicates were removed and headers rechecked. No generated build metadata is committed.
- PR #65 final-head CI: [lint/test/build](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38274983156), [E2E](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38274982589), [single commit](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38274982392), and [headers](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38274982307) passed. Local #65 tests: 42 suites / 438 tests, including 17 consumer-contract tests.
- PR #64 final-head CI: [lint/test/build](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38276275220), [E2E](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38276275210), and [single commit](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38276275069) passed. No header workflow was reported for this documentation-only change. Pages deployment was skipped for both PRs.
- This baseline package's immutable SHA and final hosted-CI snapshot are recorded in its PR body; local results above must not be represented as hosted CI.

Browser evidence uses a local static preview at `http://127.0.0.1:14370`, approved synthetic local Fineract authentication through `http://localhost:9080`, default tenant class. This is local evidence, not staging acceptance. Office reads and the held Unit empty/not-configured view were inspected for #65; no Unit runtime activation occurred.

Local artifacts in `C:/PROJECTS/MicroolOps_Web/output/playwright/`:

- `branding-baseline-before.png`: original governance notice and literal labels.
- `branding-baseline-after.png`: revised wording and Material preset controls.
- `branding-baseline-mobile.png`: 390px preview with explicit DEMO cards and wrapped footer.
- `branding-baseline-dark.png`: Signature dark mode and selected preset.
- `pr65-office-after.png`: Office surface from #65.

Native Enter selection was exercised; six preset buttons expose one pressed state. At 390px, document scroll width was 390px and the preview width approximately 333px. A Myanmar Unicode organization name was entered in the local unsaved preview. This checks input/rendering only, not a native-reviewed Myanmar translation or a full mobile accessibility audit. The repository has no Myanmar catalog. New catalog entries outside English remain English fallback text, pending native translation review.

## Storage and contrast limits

`AppearanceStorageService` uses origin-local storage keys suffixed with URI-encoded `[backendUrl, tenantIdentifier]`. There is no user identifier. Authentication sign-out removes authentication keys but retains appearance preferences. Shared accounts in the same browser profile/server/tenant can see the same appearance. This is presentation scope, not access control or institution-wide branding. Existing tests cover tenant/backend changes and blocked storage; no server persistence or authorization guarantee is made.

Computed styles confirmed the Signature light primary button uses white on `#0e6251`, and the revised Active badge uses `#0f172a` on `#e6f5f3`. Static chart colors `#10b981` and `#f59e0b` against white are approximately 2.54:1 and 2.15:1. These fail 3:1 where that graphical contrast requirement applies; inspect actual chart backgrounds, outlines and non-color encoding. Global Material button/toolbar contrast across every preset is not certified by this bounded correction. Disabled and decorative elements need separate classification.

Historical rendered-pair ratios: Signature light primary 7.28:1; revised light Active badge 15.91:1; dark Active badge (`#f8fafc` / `#103b36`) 11.80:1; dark primary (`#042f2e` / `#14b8a6`) 5.81:1. The Ocean light primary button was white on `#0284c7`, **4.10:1**. GPT1's follow-up is implemented by using the existing deeper Ocean blue `#0369a1` consistently in the Material primary palette, CSS token and preset swatch. The title catalog key `labels.text.Branding & Appearance` is now present in all shipped catalogs, retaining the existing route/title translation pipeline. Added non-English title values are explicit English fallback, not native localization.

## GPT1 follow-up diagnosis and bounded repairs

Rendered Ocean evidence on the repaired build: white on `#0369a1` is 5.93:1 at rest; the actual white hover overlay (opacity 0.04) gives 5.48:1; the white focus overlay (0.12) gives 4.67:1. Dark mode `#082f49` on `#38bdf8` is 6.48:1; System mode with a light OS preference returns 5.93:1. These are the measured normal-text states, not a blanket AA claim for all components or disabled controls. The document title is now `Branding & Appearance` in the browser. The new title regression resolves its route-derived key through I18nService for every shipped catalog.

Follow-up screenshots: `output/playwright/pr70-ocean-light-after.png`, `pr70-ocean-dark-after.png`, and `pr70-unicode-mobile-after.png`. The last includes the unsaved Myanmar/long organization name; viewport and document scroll width both measured 390px. Local preview is `http://127.0.0.1:14370/#/settings/branding-and-appearance`, through the existing synthetic default-tenant API at localhost:9080. It is an owned static development preview, not a deployed staging milestone. Login used the supported authentication flow; no injected session or financial write was used.

The scanner startup failure is independently repaired in [Web #71](https://github.com/nandahtoon/Mifosx-web-app/pull/71), head `b1e7980c6a5b0acf58053a8d74842f9e5f1cf159`. The annotation on [run 38328906800](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38328906800) says the nested job requests `actions: read` but the caller only allows `actions: none`. API inspection returned zero jobs/check runs; repository Actions were enabled with allowed_actions=all. The callee at `f18074a50d4f1973d52fd443a7acd547a45bd07e` requests actions:read. The repair adds that read-only permission and triggers scanning when the workflow changes. Scanner/security thresholds are unchanged.

#71 actual scanner runs [38457984875](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38457984875) and [38457975871](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38457975871) passed; [build](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38457984118), [E2E](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38457984072) and [single commit](https://github.com/nandahtoon/Mifosx-web-app/actions/runs/38457984060) also passed. #70 retains the scanner dependency until #71 is separately accepted/integrated; #71 success is not #70 scanner success.

Chart usage audit: `--ops-chart-*` currently has no TypeScript/HTML consumer. The product-mix component uses green/yellow dots next to text labels and a textual percentage, not those token-driven series. The financial analytics adapter uses its own blue/green and blue/red datasets; `dashboard-widget` displays labeled numeric details alongside the canvas. These provide non-color information, but do not certify every chart, every series, dark-state contrast, or screen-reader canvas semantics. No synthetic financial values were inserted into LIVE data to manufacture a chart screenshot. Broader chart remediation stays separate.

Myanmar inventory: 13 shipped locale catalogs, no `my`/`my-MM` catalog or native review. Existing Unicode transport tests remain; long-name browser evidence is supplemental. Proposed separate locale task: add an approved Myanmar locale and selector metadata, native-review translations, font/line-height/overflow checks and screen-reader review. This PR does not claim that task is complete.

Rollback: before acceptance, close the PRs; after an independently authorized merge, revert their reviewed commits through new PRs. No automatic rollback, merge or deployment is performed. Reverting #71 restores the diagnosed scanner startup failure; reverting #70 restores the old title/contrast/copy behavior without changing financial records or browser storage contracts.

## AG3 acceptance handoff

Follow-up integration check: a synthetic merge of #65 and the original #70 head found end-of-object insertion conflicts in all 13 locale catalogs. Branding entries were moved to the beginning of `labels` without changing any parsed value, keeping the Office/Unit insertion separate. This repair is part of the same bounded package; it does not merge either PR or activate Unit runtime. Verify the updated PR head and integration result rather than relying on the original `0446148` snapshot.

1. Verify the immutable PR heads and actual CI conclusions; do not infer completion from comments.
2. Review the #65 base resolution, provisional schema pin, retained Fineract contracts and Unit HOLD state. The local profile is not certified as strictly tenant-local: existing proxy fallback/selector behavior remains a limitation.
3. Review #64 against its exact upstream/governance sources and the bounded scope.
4. Reproduce branding selection with keyboard, light/dark/system modes, six presets, and narrow/desktop widths. Check rendered contrast, translated accessible names, visible focus and long text.
5. Obtain native translation review and the manual Before/After screenshots required by AGENTS.md before visual approval. Automated screenshots supplement that gate.
6. Keep Unit runtime HOLD. No merge, deployment, new backend, or financial/customer data write is authorized by this handoff.
