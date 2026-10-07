/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { parseBoolean, parseIntegerWithMin, parsePositiveNumber } from './env-parser';

describe('env-parser utilities', () => {
  describe('parseBoolean', () => {
    it('should parse boolean literals correctly', () => {
      expect(parseBoolean(true, false)).toBe(true);
      expect(parseBoolean(false, true)).toBe(false);
    });

    it('should parse strings "true" and "false" case-insensitively', () => {
      expect(parseBoolean('true', false)).toBe(true);
      expect(parseBoolean('TRUE', false)).toBe(true);
      expect(parseBoolean('false', true)).toBe(false);
      expect(parseBoolean('FALSE', true)).toBe(false);
    });

    it('should parse numeric 1 and 0 as booleans', () => {
      expect(parseBoolean('1', false)).toBe(true);
      expect(parseBoolean('0', true)).toBe(false);
    });

    it('should use fallback for undefined, null, or empty string', () => {
      expect(parseBoolean(undefined, true)).toBe(true);
      expect(parseBoolean(null, false)).toBe(false);
      expect(parseBoolean('', true)).toBe(true);
      expect(parseBoolean('unrecognized_value', false)).toBe(false);
    });
  });

  describe('parsePositiveNumber', () => {
    it('should return parsed number when valid and non-negative', () => {
      expect(parsePositiveNumber('60', 30)).toBe(60);
      expect(parsePositiveNumber('0', 30)).toBe(0);
      expect(parsePositiveNumber(300000, 60)).toBe(300000);
    });

    it('should return fallback when invalid, negative, or empty', () => {
      expect(parsePositiveNumber('-10', 30)).toBe(30);
      expect(parsePositiveNumber('invalid', 30)).toBe(30);
      expect(parsePositiveNumber('', 30)).toBe(30);
      expect(parsePositiveNumber(undefined, 30)).toBe(30);
      expect(parsePositiveNumber(null, 30)).toBe(30);
    });
  });

  describe('parseIntegerWithMin', () => {
    it('should return valid integer satisfying minimum constraint', () => {
      expect(parseIntegerWithMin('12', 1, 8)).toBe(12);
      expect(parseIntegerWithMin(8, 1, 8)).toBe(8);
    });

    it('should return fallback when value is below minimum or non-integer', () => {
      expect(parseIntegerWithMin('0', 1, 8)).toBe(8);
      expect(parseIntegerWithMin('-5', 1, 8)).toBe(8);
      expect(parseIntegerWithMin('8.5', 1, 8)).toBe(8);
      expect(parseIntegerWithMin('invalid', 1, 8)).toBe(8);
      expect(parseIntegerWithMin(undefined, 1, 8)).toBe(8);
    });
  });
});
