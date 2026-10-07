/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Safely parses boolean values from configuration inputs.
 * Accepts boolean literals, numeric strings ('1', '0'), and boolean strings ('true', 'false').
 */
export function parseBoolean(val: unknown, fallback = false): boolean {
  if (val === undefined || val === null || val === '') {
    return fallback;
  }
  if (typeof val === 'boolean') {
    return val;
  }
  const str = String(val).trim().toLowerCase();
  if (str === 'true' || str === '1') {
    return true;
  }
  if (str === 'false' || str === '0') {
    return false;
  }
  return fallback;
}

/**
 * Safely parses positive numbers (including 0) from configuration inputs.
 * Falls back if value is not a finite non-negative number.
 */
export function parsePositiveNumber(val: unknown, fallback: number): number {
  if (val === undefined || val === null || val === '') {
    return fallback;
  }
  const parsed = Number(val);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

/**
 * Safely parses integer values with a minimum constraint.
 */
export function parseIntegerWithMin(val: unknown, min: number, fallback: number): number {
  if (val === undefined || val === null || val === '') {
    return fallback;
  }
  const parsed = Number(val);
  return Number.isInteger(parsed) && parsed >= min ? parsed : fallback;
}
