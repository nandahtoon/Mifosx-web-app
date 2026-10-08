/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TestBed } from '@angular/core/testing';
import { ApplicationRef } from '@angular/core';
import { ThemingService, ThemePreset, THEME_PRESETS } from './theming.service';

describe('ThemingService', () => {
  let service: ThemingService;
  let appRefMock: Partial<ApplicationRef>;

  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';

    TestBed.configureTestingModule({
      providers: [ThemingService]
    });

    service = TestBed.inject(ThemingService);
  });

  afterEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  it('should be created and expose 6 canonical theme presets', () => {
    expect(service).toBeTruthy();
    const presets = service.getAvailablePresets();
    expect(presets.length).toBe(6);
    const ids = presets.map((p) => p.id);
    expect(ids).toContain('microops-signature');
    expect(ids).toContain('ocean-corporate');
    expect(ids).toContain('rich-purple');
    expect(ids).toContain('corporate-navy');
    expect(ids).toContain('calm-productivity');
    expect(ids).toContain('emerald-banking');
  });

  it('should default to microops-signature preset', () => {
    expect(service.getPreset()).toBe('microops-signature');
    expect(document.body.classList.contains('theme-microops-signature')).toBe(true);
  });

  it('should switch preset and apply the corresponding CSS class to body', () => {
    service.setPreset('ocean-corporate');
    expect(service.getPreset()).toBe('ocean-corporate');
    expect(document.body.classList.contains('theme-ocean-corporate')).toBe(true);
    expect(document.body.classList.contains('theme-microops-signature')).toBe(false);

    service.setPreset('emerald-banking');
    expect(service.getPreset()).toBe('emerald-banking');
    expect(document.body.classList.contains('theme-emerald-banking')).toBe(true);
    expect(document.body.classList.contains('theme-ocean-corporate')).toBe(false);
  });

  it('should switch mode to dark and update body classes and observables', () => {
    service.setMode('dark');
    expect(service.getMode()).toBe('dark');
    expect(service.isDarkMode()).toBe(true);
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(document.body.classList.contains('light-theme')).toBe(false);
    expect(service.theme.value).toBe('dark-theme');
    expect(service.isDark$.value).toBe(true);
  });

  it('should switch mode to light and update body classes and observables', () => {
    service.setMode('dark');
    service.setMode('light');
    expect(service.getMode()).toBe('light');
    expect(service.isDarkMode()).toBe(false);
    expect(document.body.classList.contains('light-theme')).toBe(true);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
    expect(service.theme.value).toBe('light-theme');
    expect(service.isDark$.value).toBe(false);
  });

  it('should maintain backward compatibility with setDarkMode', () => {
    service.setDarkMode(true);
    expect(service.isDarkMode()).toBe(true);
    expect(document.body.classList.contains('dark-theme')).toBe(true);

    service.setDarkMode(false);
    expect(service.isDarkMode()).toBe(false);
    expect(document.body.classList.contains('light-theme')).toBe(true);
  });

  it('should toggle modes in sequence', () => {
    service.setMode('light');
    service.toggleMode();
    expect(service.getMode()).toBe('dark');
    service.toggleMode();
    expect(service.getMode()).toBe('system');
    service.toggleMode();
    expect(service.getMode()).toBe('light');
  });
});
