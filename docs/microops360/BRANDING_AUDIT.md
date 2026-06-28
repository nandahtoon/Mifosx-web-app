# MicroOps 360 Branding Audit

## Purpose

Track visible product naming migration from inherited Mifos X labels to MicroOps 360 without changing runtime behavior in large unsafe batches.

## Current Verified State

| Area | Current state | Status |
| --- | --- | --- |
| Root README title | `MicroOps 360 Web` | Done |
| Root README overview | MicroOps 360 Web by Bhone Theinkha LLC with Apache Fineract-compatible integration | Done |
| Dashboard eyebrow | `MicroOps 360` | Done |
| Browser title | `MicroOps 360 Web` | Done |
| Login hero title | `MicroOps 360` | Done |
| Login logo alt text | `MicroOps 360 Logo` | Done |
| Login version label | `MicroOps 360 Web` | Done |
| Login resources branding | `MicroOps 360 Web` | Done |
| Product identity doc | `docs/microops360/PRODUCT_IDENTITY.md` | Done |
| README positioning guide | `docs/microops360/README_POSITIONING.md` | Done |

## Known Intentional Legacy References

Some Mifos and Apache Fineract references remain intentional because they describe inherited setup, proxy, Docker, environment, demo, and backend compatibility documentation.

These references should not be renamed blindly because they may refer to:

- Apache Fineract backend integration.
- Mifos demo environments.
- Existing environment variable names.
- Existing routes, selectors, CSS classes, Angular prefixes, package names, or historical release notes.
- Community documentation links inherited from the original web app.

## Completed Branding Slices

| PR | Area | Scope |
| --- | --- | --- |
| #16 | Browser title | `src/index.html` title only |
| #17 | Login page product branding | Login hero title and logo alt text only |
| #18 | Login version label | Login version info label only |
| #19 | Login resources branding | Login resources branding text only |

## Branding Migration Rules

1. User-facing product identity should use `MicroOps 360`.
2. Company ownership should use `Bhone Theinkha LLC.` where product ownership is described.
3. Backend compatibility should use `Apache Fineract-compatible` rather than implying backend ownership changes.
4. Do not rename Angular selectors, file paths, CSS classes, or environment variables unless there is a tested technical reason.
5. Do not mix Odoo into the web-app product copy unless a separate integration slice is approved.
6. Each branding change must be small, reviewable, and pass CI.

## Next Audit Targets

- Shell/header/sidenav visible labels.
- Footer backend information text outside the login screen.
- App metadata and icon asset references.
- Remaining visible community/resource labels that should stay as documentation links or be relabeled carefully.
- Any remaining visible `Mifos X`, `Mifos`, or `MifosX Enterprise` labels.

## Recommended Next Slice

Create a code-search based report for shell/header/sidenav visible labels before changing more UI text. The next implementation slice should patch only one visible area at a time and avoid renaming selectors, routes, environment variables, or backend compatibility references.
