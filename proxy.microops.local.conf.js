/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

// Match Infra APISIX_HTTP_PORT explicitly when using a non-default lab port.
const port = process.env.APISIX_HTTP_PORT || '9080';
if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
  throw new Error('APISIX_HTTP_PORT must be an integer from 1 to 65535');
}

module.exports = {
  '/fineract-provider/**': {
    target: `http://127.0.0.1:${Number(port)}`,
    changeOrigin: true
  }
};
