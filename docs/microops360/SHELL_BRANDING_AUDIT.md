# Shell/Header/Sidenav Branding Audit

## Purpose

Prepare the next MicroOps 360 visible-branding changes for shell, header, sidenav, footer, and app metadata areas without renaming technical selectors, routes, environment variables, or Apache Fineract compatibility references.

## Search Notes

Initial connector search did not return reliable shell or sidenav file hits for broad terms such as `sidenav`, `header`, `shell`, `Mifos`, and `MicroOps`. Because of that, this audit intentionally avoids broad code edits and records a conservative search-first plan.

## Verified Completed Branding Areas

| Area | Status |
| --- | --- |
| Root README title and overview | Done |
| Dashboard eyebrow | Done |
| Browser title | Done |
| Login hero title | Done |
| Login logo alt text | Done |
| Login version label | Done |
| Login resources branding | Done |
| Sidenav visible app brand text | Done |

## Verified Shell/Header Areas

| Area | Finding | Decision |
| --- | --- | --- |
| Sidenav app brand | Visible text now uses `MicroOps 360 Web` | Complete |
| Toolbar visible labels | No visible inherited product name found in the inspected toolbar template | No UI copy patch needed |
| Toolbar technical identifiers | `mifosx-*` selectors and `mifosx-toolbar` ID remain technical implementation identifiers | Do not rename without a technical migration plan |
| Shell footer outlet | Shell template renders `<mifosx-footer [styleClass]="'main-page'"></mifosx-footer>` | Inspect footer implementation before any copy patch |
| Footer locator search | Direct `footer` and `mifosx-footer` connector searches did not resolve a file; the guessed `src/app/core/shell/footer/footer.component.html` path returned 404 | Do not guess footer edits |

## Shell Branding Risk Rules

1. Do not rename Angular selectors such as `mifosx-*` without a separate technical migration plan.
2. Do not rename routes, permissions, environment variables, API identifiers, or backend compatibility terms.
3. Do not remove Apache Fineract references where they describe backend integration.
4. Change one visible UI copy area per PR.
5. Every UI copy patch must pass build, E2E, and license checks before merge.

## Candidate Areas To Inspect Next

- Footer/backend information component implementation path.
- Application shell component templates.
- Manifest and icon metadata.
- Remaining resource/community copy that is user-facing but may intentionally link to inherited community documentation.

## Recommended Next Slice

Locate the actual footer component implementation path before applying any footer/backend information branding patch.
