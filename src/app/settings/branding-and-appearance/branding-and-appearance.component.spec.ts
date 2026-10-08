/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faPalette,
  faSun,
  faMoon,
  faDesktop,
  faCheck,
  faArrowLeft,
  faInfoCircle,
  faUpload,
  faTrash,
  faSave,
  faUndo
} from '@fortawesome/free-solid-svg-icons';

import {
  BrandingAndAppearanceComponent,
  ORG_DISPLAY_NAME_STORAGE_KEY,
  ORG_LOGO_STORAGE_KEY
} from './branding-and-appearance.component';
import { ThemingService, ThemePreset, ThemeMode } from 'app/shared/theme-toggle/theming.service';
import { SettingsService } from 'app/settings/settings.service';
import { AlertService } from 'app/core/alert/alert.service';

describe('BrandingAndAppearanceComponent', () => {
  let component: BrandingAndAppearanceComponent;
  let fixture: ComponentFixture<BrandingAndAppearanceComponent>;
  let themingService: ThemingService;
  let alertService: jest.Mocked<AlertService>;
  let settingsService: Partial<SettingsService>;
  let store: Record<string, string> = {};

  beforeEach(async () => {
    store = {};
    jest.spyOn(localStorage, 'getItem').mockImplementation((key: string) => store[key] ?? null);
    jest.spyOn(localStorage, 'setItem').mockImplementation((key: string, val: string) => {
      store[key] = val;
    });
    jest.spyOn(localStorage, 'removeItem').mockImplementation((key: string) => {
      delete store[key];
    });
    jest.spyOn(localStorage, 'clear').mockImplementation(() => {
      store = {};
    });

    const alertServiceMock = {
      alert: jest.fn()
    };

    const settingsServiceMock = {
      tenantIdentifier: 'test-tenant'
    };

    await TestBed.configureTestingModule({
      imports: [
        BrandingAndAppearanceComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        ThemingService,
        { provide: AlertService, useValue: alertServiceMock },
        { provide: SettingsService, useValue: settingsServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    const iconLibrary = TestBed.inject(FaIconLibrary);
    iconLibrary.addIcons(
      faPalette,
      faSun,
      faMoon,
      faDesktop,
      faCheck,
      faArrowLeft,
      faInfoCircle,
      faUpload,
      faTrash,
      faSave,
      faUndo
    );

    themingService = TestBed.inject(ThemingService);
    alertService = TestBed.inject(AlertService) as jest.Mocked<AlertService>;
    settingsService = TestBed.inject(SettingsService);

    fixture = TestBed.createComponent(BrandingAndAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default tenant display name and default logo', () => {
    expect(component.orgDisplayNameControl.value).toBe('test-tenant');
    expect(component.displayedLogoUrl).toBe('assets/images/mifos-logo-flat.png');
    expect(component.hasUnsavedChanges).toBe(false);
  });

  it('should have 6 canonical theme presets', () => {
    expect(component.presets.length).toBe(6);
    const presetIds = component.presets.map((p) => p.id);
    expect(presetIds).toEqual([
      'microops-signature',
      'ocean-corporate',
      'rich-purple',
      'corporate-navy',
      'calm-productivity',
      'emerald-banking'
    ]);
  });

  it('should select theme preset and delegate to ThemingService', () => {
    const setPresetSpy = jest.spyOn(themingService, 'setPreset');
    component.selectPreset('corporate-navy');

    expect(setPresetSpy).toHaveBeenCalledWith('corporate-navy');
    expect(component.activePreset).toBe('corporate-navy');
  });

  it('should select theme mode and delegate to ThemingService', () => {
    const setModeSpy = jest.spyOn(themingService, 'setMode');
    component.selectMode('dark');

    expect(setModeSpy).toHaveBeenCalledWith('dark');
    expect(component.activeMode).toBe('dark');
  });

  it('should detect unsaved changes when organization display name changes', () => {
    component.orgDisplayNameControl.setValue('Custom Bank Ltd');
    expect(component.hasUnsavedChanges).toBe(true);

    component.orgDisplayNameControl.setValue('test-tenant');
    expect(component.hasUnsavedChanges).toBe(false);
  });

  it('should save branding preferences to local storage and alert success', () => {
    component.orgDisplayNameControl.setValue('Apex Financial');
    component.customLogoUrl = 'data:image/png;base64,mockLogoData';

    component.saveBranding();

    expect(localStorage.getItem(ORG_DISPLAY_NAME_STORAGE_KEY)).toBe('Apex Financial');
    expect(localStorage.getItem(ORG_LOGO_STORAGE_KEY)).toBe('data:image/png;base64,mockLogoData');
    expect(component.hasUnsavedChanges).toBe(false);
    expect(alertService.alert).toHaveBeenCalledWith(expect.objectContaining({ type: 'Branding Updated' }));
  });

  it('should remove custom logo and mark unsaved changes', () => {
    component.customLogoUrl = 'data:image/png;base64,mockLogoData';
    component.removeCustomLogo();

    expect(component.customLogoUrl).toBeNull();
    expect(component.hasUnsavedChanges).toBe(true);
    expect(component.displayedLogoUrl).toBe('assets/images/mifos-logo-flat.png');
  });

  it('should reset appearance to defaults', () => {
    const setPresetSpy = jest.spyOn(themingService, 'setPreset');
    const setModeSpy = jest.spyOn(themingService, 'setMode');

    localStorage.setItem(ORG_DISPLAY_NAME_STORAGE_KEY, 'Custom Bank');
    localStorage.setItem(ORG_LOGO_STORAGE_KEY, 'custom-logo.png');

    component.resetToDefaults();

    expect(setPresetSpy).toHaveBeenCalledWith('microops-signature');
    expect(setModeSpy).toHaveBeenCalledWith('system');
    expect(localStorage.getItem(ORG_DISPLAY_NAME_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(ORG_LOGO_STORAGE_KEY)).toBeNull();
    expect(component.customLogoUrl).toBeNull();
    expect(component.orgDisplayNameControl.value).toBe('test-tenant');
    expect(component.hasUnsavedChanges).toBe(false);
    expect(alertService.alert).toHaveBeenCalledWith(expect.objectContaining({ type: 'Branding Reset' }));
  });
});
