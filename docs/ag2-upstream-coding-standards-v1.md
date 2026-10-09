# AG2 — Upstream Mifos X Coding Standards & Compatibility Gate v1

**Owner:** AG2 (Antigravity 2), exclusive implementation owner for `nandahtoon/Mifosx-web-app`.  
**Upstream reference:** [openMF/web-app](https://github.com/openMF/web-app), particularly upstream `AGENTS.md`, `skills/SKILL.md`, `CONTRIBUTING.md` and actual project configs.  
**Local authority:** current Web `AGENTS.md`, `skills/SKILL.md`, `CONTRIBUTING.md`, `package.json`, `angular.json`, `eslint.config.js`, `.prettierrc`, `.editorconfig`, and accepted MicroOps Program governance [#127](https://github.com/nandahtoon/MicroOps-360-Fineract-Org/issues/127).  
**Status:** proposed coding contract, pending draft-PR review. This document does not certify existing code or CI.

## 1. Non-negotiable upstream-first rule

Before changing a module, AG2 must inspect the current implementation in the **exact pinned fork SHA** and the corresponding **exact pinned `openMF/web-app:dev` SHA**, then:

1. **Reuse** the existing upstream Angular feature/module/service/resolver/template pattern whenever practical.
2. **Extend** in the smallest coherent compatible increment; isolate MicroOps-specific customization, avoiding unnecessary forks and global rewrites.
3. **Preserve** upstream Fineract API contracts, authentication, navigation, accessibility, i18n, theme, license, and business workflow behavior unless an accepted MicroOps issue explicitly authorizes change.
4. **Document** intentional divergence in the PR: upstream file/commit, reason, affected contracts, upgrade/conflict risk, and tests.
5. **Do not** automatically merge/rebase upstream `dev` into active product work. Upstream sync is a dedicated branch and reviewed PR; preserve accepted MicroOps changes.

`openMF/web-app` is the coding-style/compatibility reference; **Fineract is operational system of record**. Do not confuse the upstream contribution process with authorization to modify the independent MicroOps fork.

## 2. Angular/TypeScript architecture

- Keep the repository's **Angular 20**, TypeScript, Angular Material, SCSS and existing lazy-loaded feature-module conventions. Follow existing component/service/resolver and RxJS patterns instead of inventing a parallel framework.
- Use **Reactive Forms** (`FormBuilder`, `FormGroup`, `FormControl`) for new Fineract forms; do not introduce `ngModel` template-driven patterns for new work.
- Fetch through existing Angular `HttpClient` services and route resolvers where appropriate; keep components focused on presentation and user interaction, not large inline HTTP/data engines.
- Use typed DTOs/contracts, consistent subscription/error handling, unsubscribing or async pipe patterns as applicable, and route/permission guards consistent with existing code. Do not invent endpoint fields or authorization semantics.
- Prefer reuse over dependencies; do not upgrade Angular or add large packages for a single feature without accepted justification and lockfile review.
- Maintain `mifosx` selector prefixes and existing lint conventions.

## 3. UI/UX and i18n

- Prefer Angular Material components/directives (`mat-form-field`, `mat-select`, `mat-card`, `mat-table`, buttons with Material directives) and existing shared components.
- Use upstream **8px spacing grid**, existing typography and `src/main.scss`/`src/theme/mifosx-theme.scss` variables; avoid ad-hoc global CSS, arbitrary spacing and per-page theme duplication.
- Respect keyboard navigation, focus, form labels, loading, disabled states, responsive behavior and accessibility. Show **LIVE / EMPTY / ERROR / explicit DEMO** states; never represent fake balances or counts as live.
- Every new user-facing string must use `ngx-translate` translation keys and existing locale files/workflow. Run `npm run translations:extract` when applicable and inspect its diff for unrelated churn.
- UI PRs need before/after screenshots or recorded browser evidence, including error/empty states, with an explicit `BROWSER_NOT_VERIFIED` if browser execution was unavailable.

## 4. Formatting, licensing, tests

**Authoritative settings are the checked-in configuration at the exact head**, not a copied style guide. As inspected: `.editorconfig` = UTF-8/LF/2 spaces/trim trailing whitespace; `.prettierrc` = single quotes/no trailing commas; `eslint.config.js` = Angular selector and template rules.

For every bounded Web PR:

1. Format **changed files** using the repository's pinned Prettier configuration; avoid `prettier --write .` or `headers:add` on the entire repository unless the task specifically approves repository-wide normalization. Preserve clean, reviewable diffs.
2. New/modified source files must respect MPL-2.0 header requirements; run `npm run headers:check`. If necessary, add headers only to relevant files and inspect the resulting diff.
3. Run `npm run lint`, `npm run test -- --runInBand` (or the repository-supported equivalent), targeted Jest tests, `npm run build`, and relevant `npm run playwright` tests where the required safe environment is available. Record failures honestly; do not invent PASS.
4. Inspect exact-head GitHub CI, package-lock integrity and security/license implications; distinguish CI checks from real browser/backend acceptance.
5. Use deterministic, synthetic test data only. Do not run financial mutations against real/demo/shared/staging tenants without explicit authorization.

## 5. Fineract-first, tenant security and data truth

- Supported Fineract REST API is the source for Office, Staff, Client, Group/Center, Loan, Savings, Accounting, permissions and transactions. Browser storage is **not** an alternate master database.
- Do not implement Fineract backend workarounds or domain calculations in Angular, or expose tenant/service secrets, migration exports or real PII.
- Preserve tenant/auth headers, session/logout semantics, API error responses, office/role access boundaries and server-side authorization. Never treat hidden buttons as an authorization control.
- No hard-coded localhost/staging/demo FQDN, credentials, tenant ID or APISIX address in application code; use approved runtime/config-driven settings. Verify the selected local proxy really points to the approved local backend.
- For every live workflow, verify `Browser → configuration/proxy → authenticated Fineract API → UI → refresh/re-read`. Report missing backend support as `BLOCKED_BY_BACKEND_CONTRACT` to AG1, not fabricated success.
- AG3 independently verifies local read-only QA; GPTInfra owns infrastructure and deployment. AG2 owns Web only. No cross-repo edits without a separate authorized handoff.

## 6. Branching and contribution distinctions

- **MicroOps fork work:** create one fresh task branch from current fork `dev`, one coherent change/PR targeting fork `dev`, preferably one final commit; follow existing MicroOps CI and exact-head evidence. Use issue-linked naming, e.g. `web-127-<scope>` when no upstream Jira ID exists. Never pretend a MicroOps GitHub issue is an upstream WEB Jira issue.
- **Contributions to openMF/web-app upstream:** follow upstream `CONTRIBUTING.md` fully: discuss with Mifos community, use genuine `WEB-<Jira-ID>-<scope>` branch and upstream `dev`, satisfy screenshots, license/formatting, and maintainer review. No direct upstream PR without required discussion.
- Do not force-push/overwrite another agent's active branch, auto-merge, auto-deploy to production, or mark DONE without acceptance.

## 7. PR evidence checklist (mandatory)

```text
AG2_UPSTREAM_COMPATIBILITY_REPORT
Fork repository / task / branch / exact HEAD:
Upstream openMF/web-app branch / exact comparison SHA:
Changed feature/files and upstream pattern reused:
Intentional divergences and justification:
Angular Material / Reactive Forms / RxJS / lazy module consistency:
i18n / 8px grid / SCSS theme / accessibility:
Fineract API endpoints, auth/tenant and error/empty/loading states:
Formatting / ESLint / Stylelint / Prettier / HTMLHint:
MPL-2.0 headers / translations / lockfile:
Jest / build / Playwright actual command, output, limitations:
Browser before/after and local backend proof (or UNVERIFIED):
Exact-head CI status / defects / owner handoffs:
Verdict: COMPLIANT | NONCOMPLIANT | UNVERIFIED
Next safe action:
```

## 8. Acceptance gate

A Web increment is **UPSTREAM_STYLE_COMPLIANT** only when the relevant source changes are reviewed against pinned upstream patterns, checked-in style rules pass, licensing/i18n requirements are satisfied, and required exact-head tests/CI are evidenced. This is **separate** from `WEB_LIVE_PASS`, `LOCAL_DEV_LIVE_PASS`, and staging readiness. If any required evidence is missing, report `UNVERIFIED`, not PASS.

**Agent instruction:** In the AG2 Antigravity chat, `Execute #127` means read Program Issue #127 and this repo's current `AGENTS.md`, `skills/SKILL.md` and this contract before making new Web changes. Do not block ongoing GREEN feature work for a blanket repo-wide reformat.
