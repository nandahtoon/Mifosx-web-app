# Dashboard Component Catalog

Scope: Modern MifosX dashboard.

## Shared UI Foundation

### Enterprise Card

Reusable card container for KPI, charts, alerts, and lists.

States:

- default
- loading
- empty
- error

### Page Header

Contains title, subtitle, date range, and dashboard actions.

### Status Badge

Used for loan status, task priority, approval status, and alert severity.

### Empty State

Simple message and optional action when no data exists.

### Error State

Panel-level error state. One failed API must not break the whole dashboard.

## Dashboard Components

### KPI Card

Inputs:

- title
- value
- unit
- icon
- trend
- comparison text
- link
- loading
- error

### Portfolio Trend

Line chart for portfolio trend over selected period.

Use existing chart dependency where practical.

### Portfolio by Product

Donut chart for loan product distribution.

### Alerts Panel

Shows urgent operational alerts.

Severity:

- critical
- high
- medium
- low
- info

### Today Activities

Shows disbursements, collections, new clients, visits, and meetings.

### My Tasks

Shows approvals and operational tasks assigned to the logged-in user.

### Recent Loans

Compact table for recent loan accounts.

### Top Branches

Shows branch ranking by portfolio amount and optional PAR.

### Quick Actions

Role-aware shortcuts for common actions.

Actions:

- New Client
- New Loan
- Collection Entry
- Deposit Entry
- Create Center
- Add Staff
- Reports

## Visual Direction

- Light enterprise background
- White cards
- 16px border radius
- Subtle border
- Minimal shadow
- High-density data
- Clean typography
- Meaningful color only

## Implementation Note

Start with static shell and mock data. Connect real APIs only after human approval of the visual shell.
