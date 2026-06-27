# Sprint 5: Total Portfolio Mapper and Fallback

Branch: feature/dashboard-sprint-5-mapper-fallback
Base: feature/dashboard-sprint-4-total-portfolio

## Sprint Goal

Add the mapper and fallback behavior needed before enabling a real Total Portfolio report.

## Added

- `mapTotalPortfolioValue` mapper
- mapper tests
- facade mapping path for configured report
- catchError fallback to mock dashboard state

## Mapping Strategy

The mapper supports common runreport response shapes:

1. Object row with keys:
   - totalPortfolio
   - portfolio
   - outstanding
   - amount
2. Array row using first non-empty value

## Fallback Strategy

If the report is missing, invalid, empty, or fails:

- dashboard remains in ready state
- mock dashboard data is shown
- optional message explains fallback reason

## Human Approval Required

Before real report activation:

- exact report name
- exact response shape
- currency format
- office/branch filter behavior

## Deferred

- setting real reportName
- panel-level error display
- real currency formatting
- multi-office aggregation logic
