/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Custom Models */
import { DashboardRunReportResponse } from '../models/dashboard-api.model';

export function mapTotalPortfolioValue(response: DashboardRunReportResponse): string | null {
  const firstRow = response.data?.[0]?.row;

  if (!firstRow) {
    return null;
  }

  if (Array.isArray(firstRow)) {
    const firstValue = firstRow.find((value) => value !== null && value !== undefined && value !== '');
    return firstValue ? String(firstValue) : null;
  }

  const portfolioValue = firstRow['totalPortfolio'] ?? firstRow['portfolio'] ?? firstRow['outstanding'] ?? firstRow['amount'];

  return portfolioValue !== null && portfolioValue !== undefined ? String(portfolioValue) : null;
}
