/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

(function (window) {
  // Separate opt-in asset; never overwrite the normal runtime template.
  window.env = {
    fineractApiUrl: window.location.origin,
    fineractApiUrls: window.location.origin,
    apiProvider: '/fineract-provider/api',
    apiVersion: '/v1',
    apiActuator: '/fineract-provider',
    fineractPlatformTenantId: 'default',
    fineractPlatformTenantIds: 'default',
    allowServerSwitch: false,
    displayTenantSelector: false,
    oauthServerEnabled: false,
    oidcServerEnabled: false,
    enableCopilot: false,
    mifosInterbankTransfersEnabled: false,
    mifosRemittanceEnabled: false,
    enableExternalNationalIdSystem: false,
    enablePostalCodeLookup: false,
    demoMode: false
  };
})(window);
