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

import { BrandingAndAppearanceComponent, BRANDING_STORAGE_KEY } from './branding-and-appearance.component';
import { ThemingService, ThemePreset, ThemeMode } from 'app/shared/theme-toggle/theming.service';
import { SettingsService } from 'app/settings/settings.service';
import { AlertService } from 'app/core/alert/alert.service';
import { environment } from '../../../environments/environment';
import { AppearanceStorageService } from 'app/shared/theme-toggle/appearance-storage.service';

describe('BrandingAndAppearanceComponent', () => {
  let component: BrandingAndAppearanceComponent;
  let fixture: ComponentFixture<BrandingAndAppearanceComponent>;
  let themingService: ThemingService;
  let alertService: jest.Mocked<AlertService>;
  let settingsService: Partial<SettingsService>;
  let store: Record<string, string> = {};
  let appearanceStorage: AppearanceStorageService;

  beforeEach(async () => {
    store = {};
    store['mifosXTenantIdentifier'] = 'test-tenant';
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
    appearanceStorage = TestBed.inject(AppearanceStorageService);

    fixture = TestBed.createComponent(BrandingAndAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should translate preset button names and expose selection through pressed state', () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('test', {
      labels: {
        branding: {
          presets: {
            'microops-signature': { name: 'Translated preset' }
          }
        }
      }
    });
    translate.use('test');
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button.preset-card');
    expect(buttons).toHaveLength(6);
    expect(buttons[0].getAttribute('aria-label')).toBe('Translated preset');
    buttons[1].click();
    fixture.detectChanges();
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('should initialize with default tenant display name and default logo', () => {
    expect(component.orgDisplayNameControl.value).toBe(environment.brandName);
    expect(component.displayedLogoUrl).toBe(environment.tenantLogoUrl);
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

    component.orgDisplayNameControl.setValue(environment.brandName);
    expect(component.hasUnsavedChanges).toBe(false);
  });

  it('should save branding preferences to local storage and alert success', () => {
    component.orgDisplayNameControl.setValue('Apex Financial');
    component.customLogoUrl = 'data:image/png;base64,mockLogoData';

    component.saveBranding();

    expect(JSON.parse(appearanceStorage.getItem(BRANDING_STORAGE_KEY))).toEqual({
      name: 'Apex Financial',
      logo: 'data:image/png;base64,mockLogoData'
    });
    expect(component.hasUnsavedChanges).toBe(false);
    expect(alertService.alert).toHaveBeenCalledWith(expect.objectContaining({ type: 'Branding Updated' }));
  });

  it('should remove custom logo and mark unsaved changes', () => {
    component.customLogoUrl = 'data:image/png;base64,mockLogoData';
    component.removeCustomLogo();

    expect(component.customLogoUrl).toBeNull();
    expect(component.hasUnsavedChanges).toBe(true);
    expect(component.displayedLogoUrl).toBe(environment.tenantLogoUrl);
  });

  it('should reset appearance to defaults', () => {
    const setPresetSpy = jest.spyOn(themingService, 'setPreset');
    const setModeSpy = jest.spyOn(themingService, 'setMode');

    appearanceStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify({ name: 'Custom Bank', logo: 'custom-logo.png' }));

    component.resetToDefaults();

    expect(setPresetSpy).toHaveBeenCalledWith('microops-signature');
    expect(setModeSpy).toHaveBeenCalledWith('system');
    expect(appearanceStorage.getItem(BRANDING_STORAGE_KEY)).toBeNull();
    expect(component.customLogoUrl).toBeNull();
    expect(component.orgDisplayNameControl.value).toBe(environment.brandName);
    expect(component.hasUnsavedChanges).toBe(false);
    expect(alertService.alert).toHaveBeenCalledWith(expect.objectContaining({ type: 'Branding Reset' }));
  });

  it('should preserve edits and stored branding when quota prevents saving', () => {
    appearanceStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify({ name: 'Original Bank', logo: null }));
    component.orgDisplayNameControl.setValue('Updated Bank');
    component.customLogoUrl = 'data:image/png;base64,newLogo';
    jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });
    component.saveBranding();
    expect(component.hasUnsavedChanges).toBe(true);
    expect(component.orgDisplayNameControl.value).toBe('Updated Bank');
    expect(JSON.parse(appearanceStorage.getItem(BRANDING_STORAGE_KEY)).name).toBe('Original Bank');
    expect(alertService.alert).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'Branding Updated' }));
    expect(alertService.alert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'labels.text.Branding save failed' })
    );
  });

  it('should not announce a reset when storage removal fails', () => {
    jest.spyOn(localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    component.resetToDefaults();
    expect(component.hasUnsavedChanges).toBe(true);
    expect(alertService.alert).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'Branding Reset' }));
  });

  it('should restore only the active tenant branding after switching tenants', () => {
    component.orgDisplayNameControl.setValue('Tenant A Bank');
    component.customLogoUrl = 'data:image/png;base64,tenantA';
    component.saveBranding();
    localStorage.setItem('mifosXTenantIdentifier', 'tenant-b');
    Object.defineProperty(settingsService, 'tenantIdentifier', { value: 'tenant-b', configurable: true });
    appearanceStorage.notifyScopeChanged();
    expect(component.orgDisplayNameControl.value).toBe(environment.brandName);
    expect(component.customLogoUrl).toBeNull();
    component.orgDisplayNameControl.setValue('Tenant B Bank');
    component.saveBranding();
    localStorage.setItem('mifosXTenantIdentifier', 'test-tenant');
    Object.defineProperty(settingsService, 'tenantIdentifier', { value: 'test-tenant', configurable: true });
    appearanceStorage.notifyScopeChanged();
    expect(component.orgDisplayNameControl.value).toBe('Tenant A Bank');
    expect(component.customLogoUrl).toBe('data:image/png;base64,tenantA');
  });

  it('should label the sample financial preview as demo data', () => {
    expect(fixture.nativeElement.querySelector('#live-preview-heading').textContent).toContain(
      'labels.text.Demo Appearance Preview'
    );
    expect(fixture.nativeElement.querySelector('.mock-status-pill').textContent).toContain(
      'labels.text.Demo Appearance Badge'
    );
  });
});
