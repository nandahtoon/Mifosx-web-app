/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { AlertService } from '../core/alert/alert.service';
import { SettingsService } from '../settings/settings.service';
import { AppearanceStorageService } from '../shared/theme-toggle/appearance-storage.service';
import { BRANDING_STORAGE_KEY } from '../shared/theme-toggle/branding.service';
import { ThemingService } from '../shared/theme-toggle/theming.service';
import { VersionService } from '../system/version.service';
import { environment } from '../../environments/environment';
import { LoginComponent } from './login.component';

describe('LoginComponent branding and theme integration', () => {
  let storage: AppearanceStorageService;
  let dark: BehaviorSubject<boolean>;
  let setDarkMode: jest.Mock;
  let store: Record<string, string>;

  beforeEach(async () => {
    store = { mifosXTenantIdentifier: 'tenant-a' };
    jest.spyOn(localStorage, 'getItem').mockImplementation((key) => store[key] ?? null);
    jest.spyOn(localStorage, 'setItem').mockImplementation((key, value) => {
      store[key] = value;
    });
    dark = new BehaviorSubject(false);
    setDarkMode = jest.fn();
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: AlertService, useValue: { alertEvent: new Subject() } },
        { provide: SettingsService, useValue: { tenantIdentifier: 'tenant-a', server: 'synthetic' } },
        { provide: ThemingService, useValue: { isDark$: dark, setDarkMode } },
        { provide: VersionService, useValue: { getBackendInfo: () => of({}) } },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    })
      .overrideComponent(LoginComponent, { set: { template: '', imports: [] } })
      .compileComponents();
    storage = TestBed.inject(AppearanceStorageService);
  });

  afterEach(() => jest.restoreAllMocks());

  it('uses deployment branding when there is no saved tenant identity', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.brandName).toBe(environment.brandName);
    expect(fixture.componentInstance.logoPath).toBe(environment.tenantLogoUrl);
    expect(fixture.componentInstance.logoPathDark).toBe(environment.tenantLogoUrlDark);
  });

  it('restores the saved studio identity on login and isolates tenant switches', () => {
    storage.setItem(BRANDING_STORAGE_KEY, JSON.stringify({ name: 'Tenant A Bank', logo: 'assets/a.png' }));
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.brandName).toBe('Tenant A Bank');
    expect(fixture.componentInstance.logoPath).toBe('assets/a.png');
    expect(fixture.componentInstance.logoPathDark).toBe('assets/a.png');
    store['mifosXTenantIdentifier'] = 'tenant-b';
    storage.notifyScopeChanged();
    expect(fixture.componentInstance.brandName).toBe(environment.brandName);
    expect(fixture.componentInstance.logoPath).toBe(environment.tenantLogoUrl);
    store['mifosXTenantIdentifier'] = 'tenant-a';
    storage.notifyScopeChanged();
    expect(fixture.componentInstance.brandName).toBe('Tenant A Bank');
  });

  it('follows theme changes without replacing the saved System mode', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    expect(setDarkMode).not.toHaveBeenCalled();
    dark.next(true);
    expect(fixture.componentInstance.themeDarkEnabled).toBe(true);
    dark.next(false);
    expect(fixture.componentInstance.themeDarkEnabled).toBe(false);
  });
});
