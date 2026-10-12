# MicroOps 360 Experience Design Token Contract & Architecture Specification

**Version:** 1.0.0 (WEB-365)  
**Status:** CANONICAL BASELINE  
**Classification:** Frontend Experience Architecture & Governance Contract  
**Governing Standard:** Angular Material M2 theming with CSS tokens; WCAG 2.1 AA verification targets

---

## 1. Executive Summary & Architecture Boundary

The **MicroOps Experience Foundation** transforms the Mifos X web client presentation into a modern, enterprise-grade, institutional core banking workspace—**MicroOps 360**—while strictly preserving Apache Fineract core API contracts, role-based access controls (RBAC), and accounting integrity.

This contract defines:

1. **Four-layer design token hierarchy** decoupling brand aesthetics from operational semantics.
2. **6 Canonical theme presets** covering microfinance, digital banking, cooperative, and enterprise institutional palettes.
3. **Component-specific WCAG 2.1 AA contrast verification targets** across daylight, low-glare dark, and system-adaptive modes.
4. **Backend Contract Status**: No approved server branding contract is integrated in this client (`BLOCKED_BY_BACKEND_CONTRACT`). Browser preference scope and retention are documented below.

```
+-----------------------------------------------------------------------------------+
|                           MicroOps 360 Client Layer                               |
+-----------------------------------------------------------------------------------+
|  Layer A: Theme Presets (6 Canonical Palettes: Primary, Accent, Containers)       |
|  Layer B: Fixed System Semantic Status Tokens (Success, Warning, Error, Critical) |
|  Layer C: Financial Multi-Color Visualization Palette (8 Series Requiring Contextual Verification)    |
|  Layer D: Surface, Elevation, Radius & Spacing Hierarchy                          |
+-----------------------------------------------------------------------------------+
                                    |
                                    | Client Persistence (ThemingService)
                                    v
+-----------------------------------------------------------------------------------+
|  Browser Local Storage: Backend/Tenant Preferences (Not User-Isolated)                               |
|  - microopsThemePreset | microopsThemeMode | microopsBranding (name + logo)           |
+-----------------------------------------------------------------------------------+
                                    |
                                    x BLOCKED_BY_BACKEND_CONTRACT
                                    v
+-----------------------------------------------------------------------------------+
|  Apache Fineract Core REST Backend (No approved branding endpoint integrated)     |
+-----------------------------------------------------------------------------------+
```

---

## 2. Four-Layer Token Architecture

### 2.1 Layer A: Brand / Theme Presets

Theme presets define the ambient primary, accent, and interactive container hues of the application. They can be freely changed by operators without altering the fixed business meaning of operational states.

| Preset Identifier    | Display Name           | Light Primary               | Light Accent              | Dark Primary             | Dark Accent                | Target Institution                 |
| :------------------- | :--------------------- | :-------------------------- | :------------------------ | :----------------------- | :------------------------- | :--------------------------------- |
| `microops-signature` | **MicroOps Signature** | `#0e6251` (Petrol Teal)     | `#0f766e` (Cyan Teal)     | `#2ec4b6` (Mint Teal)    | `#14b8a6` (Teal Accent)    | Default MicroOps 360 operations    |
| `ocean-corporate`    | **Ocean Corporate**    | `#0369a1` (Deep Azure)      | `#0369a1` (Deep Azure)    | `#38bdf8` (Sky Dark)     | `#0284c7` (Ocean Accent)   | Commercial & Tier-1 Microfinance   |
| `rich-purple`        | **Rich Purple**        | `#6d28d9` (Royal Purple)    | `#7c3aed` (Violet)        | `#a78bfa` (Light Purple) | `#8b5cf6` (Soft Violet)    | Fintechs & Digital Neobanks        |
| `corporate-navy`     | **Corporate Navy**     | `#1e40af` (Midnight Navy)   | `#1d4ed8` (Royal Blue)    | `#60a5fa` (Blue Light)   | `#3b82f6` (Cobalt Blue)    | Apex Banks & Regulatory Bodies     |
| `calm-productivity`  | **Calm Productivity**  | `#475569` (Slate Steel)     | `#334155` (Deep Slate)    | `#94a3b8` (Light Slate)  | `#64748b` (Medium Slate)   | High-volume Back-Office & Auditing |
| `emerald-banking`    | **Emerald Banking**    | `#047857` (Botanical Green) | `#059669` (Forest Accent) | `#34d399` (Mint Green)   | `#10b981` (Emerald Accent) | Agricultural & Rural Credit Unions |

#### CSS Custom Properties (Layer A)

```css
/* Active Theme Preset Custom Properties */
--ops-primary: #0e6251;
--ops-primary-hover: #0a4f41;
--ops-primary-container: #e6f5f3;
--ops-primary-on-container: #063b36;
--ops-accent: #0f766e;
--ops-accent-container: #ccfbf1;
--ops-focus-ring: 0 0 0 2px var(--ops-surface-card), 0 0 0 4px var(--ops-primary);
```

---

### 2.2 Layer B: Fixed System Semantic Status Tokens

System semantic tokens represent immutable operational conditions. **Their meaning is invariant across all 6 theme presets** to eliminate operator confusion during field operations, loan approvals, and delinquency reviews.

| Semantic Token          | Meaning & Lifecycle State                                | Light Foreground | Light Surface (Bg) | Light Border | Dark Foreground | Dark Surface (Bg) |
| :---------------------- | :------------------------------------------------------- | :--------------- | :----------------- | :----------- | :-------------- | :---------------- |
| `--ops-status-success`  | Active, Paid, Disbursed, Approved, Healthy               | `#15803d`        | `#ecfdf5`          | `#86efac`    | `#4ade80`       | `#064e3b`         |
| `--ops-status-warning`  | Pending, In Review, Maturing, Approaching Due            | `#b45309`        | `#fffbeb`          | `#fcd34d`    | `#fbbf24`       | `#78350f`         |
| `--ops-status-error`    | Overdue, Arrears, Rejected, Failed, Breach               | `#b91c1c`        | `#fef2f2`          | `#fca5a5`    | `#f87171`       | `#7f1d1d`         |
| `--ops-status-critical` | Defaulted, Written-off, Fraud Alert, Severely Delinquent | `#881337`        | `#fff1f2`          | `#f43f5e`    | `#fda4af`       | `#4c0519`         |
| `--ops-status-info`     | Submitted, Informational, Audited, Transferred           | `#0369a1`        | `#f0f9ff`          | `#7dd3fc`    | `#38bdf8`       | `#0c4a6e`         |
| `--ops-status-progress` | In Process, Batch Running, Calculation Active            | `#6d28d9`        | `#faf5ff`          | `#d8b4fe`    | `#c084fc`       | `#581c87`         |
| `--ops-status-neutral`  | Closed, Dormant, Inactive, Zero Balance, Withdrawn       | `#475569`        | `#f1f5f9`          | `#cbd5e1`    | `#94a3b8`       | `#1e293b`         |

---

### 2.3 Layer C: Multi-Color Data Visualization Palette

Charts, portfolio distribution diagrams, and multi-series financial graphs require distinguishable, high-contrast hues that remain accessible against both light and dark card surfaces.

| Token           | Semantic Financial Assignment              | Hex Value | Surface to Verify                 |
| :-------------- | :----------------------------------------- | :-------- | :-------------------------------- |
| `--ops-chart-1` | Outstanding Principal / Active Portfolio   | `#0284c7` | Card Surface (`#fff` / `#1e293b`) |
| `--ops-chart-2` | Collections / Repayments / Inflow          | `#10b981` | Card Surface (`#fff` / `#1e293b`) |
| `--ops-chart-3` | Savings / Term Deposits / Liabilities      | `#8b5cf6` | Card Surface (`#fff` / `#1e293b`) |
| `--ops-chart-4` | Portfolio at Risk (PAR) / Arrears          | `#f59e0b` | Card Surface (`#fff` / `#1e293b`) |
| `--ops-chart-5` | Operational Income / Fees / Commissions    | `#06b6d4` | Card Surface (`#fff` / `#1e293b`) |
| `--ops-chart-6` | Operational Expense / Loan Loss Provisions | `#ef4444` | Card Surface (`#fff` / `#1e293b`) |
| `--ops-chart-7` | Institutional Capital / Retained Earnings  | `#ec4899` | Card Surface (`#fff` / `#1e293b`) |
| `--ops-chart-8` | Liquidity / Cash in Vault / Interbank      | `#64748b` | Card Surface (`#fff` / `#1e293b`) |

---

### 2.4 Layer D: Surface, Elevation & Grid Hierarchy

#### Canvas & Surface Contrast Standard

In MicroOps 360, **pure `#FFFFFF` and pure `#000000` are strictly disallowed as dominant viewport backgrounds**:

- **Light Mode Canvas (`--ops-bg-app`)**: Soft Smoke Slate (`#f4f6f9`), creating natural depth separation for white card surfaces (`#ffffff`).
- **Dark Mode Canvas (`--ops-bg-app`)**: Midnight Slate (`#0f172a`), creating low glare for elevated card surfaces (`#1e293b`).

#### Elevation & Shadows

```css
--ops-shadow-xs: 0 1px 2px rgb(15 23 42 / 5%);
--ops-shadow-sm: 0 2px 4px rgb(15 23 42 / 6%), 0 1px 2px rgb(15 23 42 / 4%);
--ops-shadow-md: 0 4px 6px -1px rgb(15 23 42 / 8%), 0 2px 4px -2px rgb(15 23 42 / 6%);
--ops-shadow-lg: 0 10px 15px -3px rgb(15 23 42 / 8%), 0 4px 6px -4px rgb(15 23 42 / 4%);
```

#### 8px Layout Rhythm, Existing 4px Subgrid & Border Radii

```css
--ops-space-1: 4px;
--ops-space-2: 8px;
--ops-space-3: 12px;
--ops-space-4: 16px;
--ops-space-5: 20px;
--ops-space-6: 24px;
--ops-space-8: 32px;
--ops-space-10: 40px;
--ops-space-12: 48px;

--ops-radius-xs: 2px;
--ops-radius-sm: 4px;
--ops-radius-md: 8px;
--ops-radius-lg: 12px;
--ops-radius-full: 9999px;
```

---

## 3. Mode Behavior & Operating System Synchronization

The theming engine supports three distinct operational modes managed via `ThemingService`:

1. **Light Mode (`light`)**: Clean daylight appearance optimized for high ambient light in bank branches and field operations.
2. **Dark Mode (`dark`)**: Comfortable low-glare dark appearance for back-office operators and extended shifts.
3. **System Mode (`system`)**: Dynamically binds to the operating system's color preference using `window.matchMedia('(prefers-color-scheme: dark)')`. The client listens reactively to OS scheme changes and updates the active CSS class list on `document.body` without requiring a page reload.

### Contrast Verification Targets (WCAG 2.1 AA)

Measure actual rendered foreground/background pairs in each relevant state. The following are targets, not a blanket certification:

- **Normal text (< 18pt / < 14pt bold):** Minimum contrast ratio of **4.5:1**.
- **Large text (>= 18pt / >= 14pt bold):** Minimum contrast ratio of **3.0:1**.
- **UI components & interactive boundaries:** Minimum contrast ratio of **3.0:1**.

---

## 4. Backend Contract Governance (`BLOCKED_BY_BACKEND_CONTRACT`)

### 4.1 Fineract REST Contract Analysis

Apache Fineract core exposes REST endpoints for financial configuration, loan products, offices, users, and reports (`/fineract-provider/api/v1/*`). **This client has no approved server contract for visual theming or custom logo storage. This is not an exhaustive claim about all Fineract versions or extensions.**

- Status: `BLOCKED_BY_BACKEND_CONTRACT`
- Unapproved example resource paths (do not call): `/fineract-provider/api/v1/branding` or `/fineract-provider/api/v1/tenants/{tenantId}/branding`
- Architecture Strategy: **Graceful Client-Side Tenant Storage with Fail-Safe Defaults.**

### 4.2 Client Persistence Specification

When users configure appearance preferences in the **Branding & Appearance Studio** (`/settings/branding-and-appearance`), preferences are stored in origin-local browser storage with backend and tenant keys:

All keys below are suffixed with `:` and the URI-encoded JSON array `[backendUrl, tenantIdentifier]`. Changing backend or tenant through SettingsService reloads that scope's preferences immediately. Unscoped legacy preferences are ignored because their owning tenant is unknown; users must reselect them once. These settings remain local to this browser and are not institution-wide configuration.

Organization name and logo are stored together in one `microopsBranding` JSON record, so a failed write cannot partially update the identity. Failed saves or resets show an error and retain unsaved edits. The studio preview and login page consume this record through `BrandingService`; the application shell and reports do not currently consume it. Financial figures in the preview are explicitly labeled DEMO DATA.

Login defaults to **MifosOps**, configured centrally through `MIFOS_BRAND_NAME` (`window.env.brandName`). Deployment logos continue to use `TENANT_LOGO_URL` and `TENANT_LOGO_URL_DARK`; existing logo assets are retained. A saved name/logo in **Settings → Branding & Appearance** takes precedence for the active backend and tenant in this browser, including after logout and page refresh. Reset restores deployment defaults. Other browsers/devices use deployment defaults until configured locally; institution-wide branding synchronization remains `BLOCKED_BY_BACKEND_CONTRACT`.

Login colors follow the active theme preset and light/dark/system mode. Entering login does not replace System mode. Switching backend or tenant reloads the corresponding branding and theme preferences without carrying another tenant's identity across scopes.

Container startup transports `MIFOS_BRAND_NAME` as UTF-8 base64 before template substitution and decodes it as text in the browser. Apostrophes, backslashes, newlines, and Unicode therefore remain name data rather than JavaScript source. `MIFOS_BRAND_NAME_BASE64` is generated internally at startup; operators configure only `MIFOS_BRAND_NAME`.

| Storage Key              | Type                                     | Fallback Default               | Description                                           |
| :----------------------- | :--------------------------------------- | :----------------------------- | :---------------------------------------------------- |
| `microopsThemePreset`    | `string`                                 | `'microops-signature'`         | Active canonical theme preset ID                      |
| `microopsThemeMode`      | `'light' \| 'dark' \| 'system'`          | `'system'`                     | Active appearance mode                                |
| `microopsBranding`       | `{ name: string, logo: string \| null }` | Configured brand name and logo | Organization identity in the studio preview and login |
| `mifosXThemeDarkEnabled` | `boolean`                                | Computed boolean               | Backward-compatibility mirror for legacy components   |

### 4.3 Future Server Synchronization Path

Server synchronization requires an approved API, authorization rules, failure behavior, migration design, and separate implementation. Current browser storage does not provide that contract.

---

## 5. Component Binding & Mapping Matrix

| UI Component                              | Applied CSS Custom Property                                  | Source Layer | Visual Manifestation               |
| :---------------------------------------- | :----------------------------------------------------------- | :----------- | :--------------------------------- |
| **Top Navigation Toolbar**                | `var(--ops-primary)`                                         | Layer A      | Header background bar              |
| **Sidenav Active Item**                   | `var(--ops-primary)` + `var(--ops-primary-container)`        | Layer A      | Active route indicator pill & icon |
| **Primary Buttons (`mat-raised-button`)** | `var(--ops-primary)` + `#fff`                                | Layer A      | Main call-to-action buttons        |
| **Accent Buttons**                        | `var(--ops-accent)`                                          | Layer A      | Secondary highlights & tools       |
| **Operational Metric Cards**              | `var(--ops-surface-card)` + `var(--ops-border)`              | Layer D      | Dashboard KPI summary containers   |
| **Status Badge: Active / Paid**           | `var(--ops-status-success)` + `var(--ops-status-success-bg)` | Layer B      | Account & loan status chips        |
| **Status Badge: Overdue / Arrears**       | `var(--ops-status-error)` + `var(--ops-status-error-bg)`     | Layer B      | Delinquency warning chips          |
| **Status Badge: In Review**               | `var(--ops-status-warning)` + `var(--ops-status-warning-bg)` | Layer B      | Maker-checker pending chips        |
| **Data Tables (`mat-table`)**             | `var(--ops-surface-head)` + `var(--ops-border)`              | Layer D      | Table headers & alternate rows     |
| **Portfolio Charts**                      | `var(--ops-chart-1)` through `var(--ops-chart-8)`            | Layer C      | Multi-series graph fills & strokes |

---

## 6. Verification and Limits

The implementation uses Angular Material M2 theming APIs, with four CSS token layers A–D. M3 migration is not part of this contract. Use an 8px layout rhythm and reuse the existing 4px subgrid tokens for compact spacing (4px, 12px, 20px); these are explicit fork tokens rather than arbitrary additions.

Browser origin/profile and the exact backend URL plus tenant identifier determine the preference namespace. There is no user identifier. Signing out removes authentication state but retains appearance preferences, so accounts sharing that browser profile and scope share preferences. This is not an RBAC boundary. URL spelling changes, clearing browser data, blocked storage, and different devices can change availability.

Static chart swatches #10b981 and #f59e0b against white measure approximately 2.54:1 and 2.15:1. They do not meet 3:1 where a graphical object requires that contrast. Review the actual chart background, outlines, labels, and non-color encoding before classifying a rendered chart. Decorative and disabled elements require separate classification. No universal AA guarantee is made.

Exact commit checks and browser evidence belong to each delivery report. Historical test counts and CI outcomes are not certification of later commits. Unit runtime remains HOLD.
