/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TextDecoder } from 'node:util';
import { runInNewContext } from 'node:vm';

describe('Container brand-name transport', () => {
  it.each([
    '',
    'MifosOps',
    "St. Mary's Bank",
    'Bank \\ branch\nsecond line',
    'မြန်မာ Bank — 日本',
    "'; globalThis.brandCodeExecuted = true; //"
  ])('keeps %j as data without breaking the runtime configuration', (brandName) => {
    const encoded = Buffer.from(brandName, 'utf8').toString('base64');
    const source = readFileSync(resolve('src/assets/env.template.js'), 'utf8').replace(/\$([A-Z_0-9]+)/g, (_, key) =>
      key === 'MIFOS_BRAND_NAME_BASE64' ? encoded : ''
    );
    const context = {
      TextDecoder,
      Uint8Array,
      atob: (value: string) => Buffer.from(value, 'base64').toString('binary'),
      env: {} as Record<string, string>,
      brandCodeExecuted: false
    };
    runInNewContext(source, context);
    expect(context.env['brandName']).toBe(brandName);
    expect(context.brandCodeExecuted).toBe(false);
    expect(context.env).toHaveProperty('fineractApiUrl');
  });
});
