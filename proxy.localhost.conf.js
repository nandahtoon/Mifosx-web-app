/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/**
 * Proxy configuration for running the app against a local Fineract instance.
 * Usage:
 *   ng serve --proxy-config proxy.localhost.conf.js
 */

function resolveLoopbackTarget() {
  const candidate = process.env.LOCAL_GATEWAY_URL || process.env.FINERACT_API_URL || 'http://localhost:9080';
  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]') {
      return candidate;
    }
    console.warn(
      `[Proxy Local] Security guard: target "${candidate}" is not a loopback address. Falling back to http://localhost:9080.`
    );
  } catch (err) {
    console.warn(`[Proxy Local] Invalid target URL "${candidate}". Falling back to http://localhost:9080.`);
  }
  return 'http://localhost:9080';
}

const target = resolveLoopbackTarget();

module.exports = [
  {
    context: ['/fineract-provider'],
    target: target,
    changeOrigin: true,
    secure: target.startsWith('https:'),
    logLevel: 'debug',
    onProxyReq: function (proxyReq, req, res) {
      console.log('[Proxy Local] Proxying:', req.method, req.url, '->', this.target + req.url);
    },
    onError: function (err, req, res) {
      console.error(
        '[Proxy Local] Error while proxying request:',
        req && req.method,
        req && req.url,
        '->',
        this.target,
        '-',
        err && err.message
      );
      if (res && !res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Proxy error: ' + (err && err.message ? err.message : 'Unknown error'));
      }
    }
  }
];
