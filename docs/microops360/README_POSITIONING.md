# MicroOps 360 README Positioning Guide

## Purpose

This document defines the short product introduction that should be added to the root `README.md` in a later small patch.

## Proposed README Title

```markdown
# MicroOps 360 Web
```

## Proposed README Overview

```markdown
MicroOps 360 Web is an Angular-based microfinance operations web application by Bhone Theinkha LLC. It keeps Apache Fineract-compatible API integration patterns while introducing the MicroOps 360 product identity.
```

## Product Focus

MicroOps 360 focuses on branch operations, portfolio visibility, collections, approvals, reporting, and field activity workflows for microfinance institutions.

## Compatibility Statement

MicroOps 360 Web keeps Apache Fineract-compatible API integration as a key technical foundation. Product identity changes must not break backend contracts.

## Migration Rule

Root README changes must be applied incrementally. Avoid rewriting the full legacy README in one large change because it contains setup, proxy, Docker, environment, and development documentation.

## Next Safe README Slice

- Add a short `MicroOps 360 Web` introduction above the existing overview.
- Preserve existing installation and Fineract setup instructions.
- Keep inherited technical setup notes until each section is reviewed.
