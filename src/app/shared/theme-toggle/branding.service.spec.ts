/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AppearanceStorageService } from './appearance-storage.service';
import { BrandingService } from './branding.service';

describe('BrandingService', () => {
  let service: BrandingService;
  let storage: { getItem: jest.Mock };

  beforeEach(() => {
    storage = { getItem: jest.fn().mockReturnValue(null) };
    TestBed.configureTestingModule({ providers: [{ provide: AppearanceStorageService, useValue: storage }] });
    service = TestBed.inject(BrandingService);
  });

  it('uses configurable deployment defaults without a saved identity', () => {
    const originalName = environment.brandName;
    try {
      environment.brandName = 'Deployment Bank';
      expect(service.read()).toEqual({ name: 'Deployment Bank', logo: null });
      expect(service.defaultLogo).toBe(environment.tenantLogoUrl);
      expect(service.defaultDarkLogo).toBe(environment.tenantLogoUrlDark);
    } finally {
      environment.brandName = originalName;
    }
  });

  it('reads the studio identity from the shared scoped record', () => {
    storage.getItem.mockReturnValue(JSON.stringify({ name: '  Tenant Bank  ', logo: 'assets/tenant.png' }));
    expect(service.read()).toEqual({ name: 'Tenant Bank', logo: 'assets/tenant.png' });
    expect(storage.getItem).toHaveBeenCalledWith('microopsBranding');
  });

  it.each([
    'invalid json',
    'null',
    '{"name":{},"logo":42}',
    '{"name":" ","logo":" "}'
  ])('falls back safely for malformed or empty preferences: %s', (stored) => {
    storage.getItem.mockReturnValue(stored);
    expect(service.read()).toEqual({ name: environment.brandName, logo: null });
  });
});
