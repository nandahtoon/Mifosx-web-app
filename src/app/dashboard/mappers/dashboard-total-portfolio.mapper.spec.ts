/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { describe, expect, it } from '@jest/globals';

import { mapTotalPortfolioValue } from './dashboard-total-portfolio.mapper';

describe('mapTotalPortfolioValue', () => {
  it('should map object row totalPortfolio value', () => {
    expect(mapTotalPortfolioValue({ data: [{ row: { totalPortfolio: 'MMK 100M' } }] })).toBe('MMK 100M');
  });

  it('should map first non-empty array row value', () => {
    expect(mapTotalPortfolioValue({ data: [{ row: ['', 'MMK 200M'] }] })).toBe('MMK 200M');
  });

  it('should return null when response has no usable value', () => {
    expect(mapTotalPortfolioValue({ data: [] })).toBeNull();
  });
});
