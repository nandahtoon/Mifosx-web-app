# MicroOps 360 Branding Audit

## Purpose

Track visible product naming migration from inherited Mifos X labels to MicroOps 360 without changing runtime behavior in large unsafe batches.

## Current Verified State

| Area | Current state | Status |
| --- | --- | --- |
| Root README title | `MicroOps 360 Web` | Done |
| Root README overview | MicroOps 360 Web by Bhone Theinkha LLC with Apache Fineract-compatible integration | Done |
| Dashboard eyebrow | `MicroOps 360` | Done |
| Product identity doc | `docs/microops360/PRODUCT_IDENTITY.md` | Done |
| README positioning guide | `docs/microops360/README_POSITIONING.md` | Done |

## Known Intentional Legacy References

Some Mifos and Apache Fineract references remain intentional because they describe inherited setup, proxy, Docker, environment, demo, and backend compatibility documentation.

These references should not be renamed blindly because they may refer to:

- Apache Fineract backend integration.
- Mifos demo environments.
- Existing environment variable names.
- Existing routes, selectors, CSS classes, Angular prefixes, package names, or historical release notes.

## Branding Migration Rules

1. User-facing product identity should use `MicroOps 360`.
2. Company ownership should use `Bhone Theinkha LLC.` where product ownership is described.
3. Backend compatibility should use `Apache Fineract-compatible` rather than implying backend ownership changes.
4. Do not rename Angular selectors, file paths, CSS classes, or environment variables unless there is a tested technical reason.
5. Do not mix Odoo into the web-app product copy unless a separate integration slice is approved.
6. Each branding change must be small, reviewable, and pass CI.

## Next Audit Targets

- Login page product labels.
- Browser title and app metadata.
- Shell/header/sidenav visible labels.
- Footer backend information text.
- Any remaining visible `Mifos X`, `Mifos`, or `MifosX Enterprise` labels.

## Recommended Next Slice

Create a code-search based report for visible labels before changing more UI text. The next implementation slice should patch only one visible area at a time, starting with browser title or login page copy.
