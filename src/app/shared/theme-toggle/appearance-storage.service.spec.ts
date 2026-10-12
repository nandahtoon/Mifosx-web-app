/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TestBed } from '@angular/core/testing';
import { Dates } from 'app/core/utils/dates';
import { SettingsService } from 'app/settings/settings.service';
import { AppearanceStorageService } from './appearance-storage.service';
import { ThemingService } from './theming.service';

describe('Appearance storage isolation', () => {
  let storage: AppearanceStorageService;
  let settings: SettingsService;

  beforeEach(() => {
    const values: Record<string, string> = {};
    jest.spyOn(localStorage, 'getItem').mockImplementation((key: string) => values[key] ?? null);
    jest.spyOn(localStorage, 'setItem').mockImplementation((key: string, value: string) => {
      values[key] = value;
    });
    jest.spyOn(localStorage, 'removeItem').mockImplementation((key: string) => {
      delete values[key];
    });
    TestBed.configureTestingModule({ providers: [{ provide: Dates, useValue: {} }] });
    storage = TestBed.inject(AppearanceStorageService);
    settings = TestBed.inject(SettingsService);
    settings.setServer('https://bank-a.example');
    settings.setTenantIdentifier('tenant-a');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
    document.body.className = '';
  });

  it('isolates the same preference by tenant and server, including removals', () => {
    storage.setItem('microopsBranding', 'Bank A');
    settings.setTenantIdentifier('tenant-b');
    expect(storage.getItem('microopsBranding')).toBeNull();
    storage.setItem('microopsBranding', 'Bank B');
    settings.setTenantIdentifier('tenant-a');
    settings.setServer('https://bank-b.example');
    expect(storage.getItem('microopsBranding')).toBeNull();
    storage.removeItem('microopsBranding');
    settings.setServer('https://bank-a.example');
    expect(storage.getItem('microopsBranding')).toBe('Bank A');
    settings.setTenantIdentifier('tenant-b');
    expect(storage.getItem('microopsBranding')).toBe('Bank B');
  });

  it('reloads the theme on scope changes and does not adopt unscoped legacy settings', () => {
    localStorage.setItem('microopsThemePreset', 'rich-purple');
    localStorage.setItem('mifosXThemeDarkEnabled', 'true');
    const theme = TestBed.inject(ThemingService);
    expect(theme.getPreset()).toBe('microops-signature');
    expect(theme.getMode()).toBe('system');
    theme.setPreset('ocean-corporate');
    theme.setMode('dark');
    settings.setTenantIdentifier('tenant-b');
    expect(theme.getPreset()).toBe('microops-signature');
    expect(theme.getMode()).toBe('system');
    theme.setPreset('emerald-banking');
    theme.setMode('light');
    settings.setTenantIdentifier('tenant-a');
    expect(theme.getPreset()).toBe('ocean-corporate');
    expect(theme.getMode()).toBe('dark');
    expect(settings.themeDarkEnabled).toBe(true);
    settings.setServer('https://bank-b.example');
    expect(theme.getPreset()).toBe('microops-signature');
  });

  it('reports blocked writes and deletes without throwing', () => {
    jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    jest.spyOn(localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    expect(storage.setItem('microopsBranding', 'Bank')).toBe(false);
    expect(storage.removeItem('microopsBranding')).toBe(false);
  });
});
