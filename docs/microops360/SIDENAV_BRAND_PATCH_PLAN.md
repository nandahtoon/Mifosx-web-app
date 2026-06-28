# Sidenav Brand Patch Plan

## Purpose

Prepare the first MicroOps 360 shell UI patch without risking a partial template replacement.

## Verified Target

Target file:

`src/app/core/shell/sidenav/sidenav.component.html`

Current visible brand line:

```html
<span #logo class="app-logo-text text-muted">{{ 'APP_NAME' | translate }}</span>
```

Desired visible brand line:

```html
<span #logo class="app-logo-text text-muted">MicroOps 360 Web</span>
```

## Safety Decision

The GitHub content update API requires complete file replacement. Because this template is long, the safe implementation should use an exact local patch or a tool that can apply a one-line diff without replacing the full template content.

## Guardrails

- Do not rename `mifosx-sidenav`.
- Do not change routes or permissions.
- Do not change logo asset path in this slice.
- Do not change user panel or navigation items.
- Patch only the visible brand text line.

## Recommended Next Slice

Apply the one-line sidenav brand text patch with a diff-based edit tool, then run the full CI gate before merge.
