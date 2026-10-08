/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import {
  ThemingService,
  ThemePreset,
  ThemeMode,
  ThemePresetOption,
  THEME_PRESETS
} from 'app/shared/theme-toggle/theming.service';
import { SettingsService } from 'app/settings/settings.service';
import { AlertService } from 'app/core/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

export const ORG_DISPLAY_NAME_STORAGE_KEY = 'microopsOrgDisplayName';
export const ORG_LOGO_STORAGE_KEY = 'microopsOrgLogo';

export interface ThemeModeItem {
  id: ThemeMode;
  labelKey: string;
  icon: string;
  descriptionKey: string;
}

/**
 * MicroOps Branding and Appearance Management Studio Component.
 * Supports visual 6-preset theme selection, light/dark/system mode toggling,
 * tenant organization branding configuration, live operational preview,
 * and contract governance documentation.
 */
@Component({
  selector: 'mifosx-branding-and-appearance',
  templateUrl: './branding-and-appearance.component.html',
  styleUrls: ['./branding-and-appearance.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    ReactiveFormsModule,
    RouterModule,
    MatButton,
    MatTooltip,
    FaIconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandingAndAppearanceComponent implements OnInit {
  private themingService = inject(ThemingService);
  private settingsService = inject(SettingsService);
  private alertService = inject(AlertService);
  private translateService = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  presets: ThemePresetOption[] = THEME_PRESETS;
  activePreset: ThemePreset = 'microops-signature';
  activeMode: ThemeMode = 'system';
  isDark = false;

  modes: ThemeModeItem[] = [
    {
      id: 'light',
      labelKey: 'labels.text.Light Mode',
      icon: 'sun',
      descriptionKey: 'labels.text.Light Mode Description'
    },
    {
      id: 'dark',
      labelKey: 'labels.text.Dark Mode',
      icon: 'moon',
      descriptionKey: 'labels.text.Dark Mode Description'
    },
    {
      id: 'system',
      labelKey: 'labels.text.System Mode',
      icon: 'desktop',
      descriptionKey: 'labels.text.System Mode Description'
    }
  ];

  orgDisplayNameControl = new FormControl<string>('');
  customLogoUrl: string | null = null;
  readonly defaultLogoUrl = 'assets/images/mifos-logo-flat.png';

  hasUnsavedChanges = false;
  private initialDisplayName = '';
  private initialLogoUrl: string | null = null;

  ngOnInit(): void {
    // 1. Observe active theme preset
    this.activePreset = this.themingService.getPreset();
    this.themingService.preset$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((preset) => {
      this.activePreset = preset;
      this.cdr.markForCheck();
    });

    // 2. Observe theme mode & dark calculation
    this.activeMode = this.themingService.getMode();
    this.themingService.mode$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((mode) => {
      this.activeMode = mode;
      this.cdr.markForCheck();
    });

    this.isDark = this.themingService.isDarkMode();
    this.themingService.isDark$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((dark) => {
      this.isDark = dark;
      this.cdr.markForCheck();
    });

    // 3. Load organization display name
    const storedName = this.readStorage(ORG_DISPLAY_NAME_STORAGE_KEY);
    const defaultName = storedName || this.settingsService.tenantIdentifier || 'MicroOps 360';
    this.initialDisplayName = defaultName;
    this.orgDisplayNameControl.setValue(defaultName, { emitEvent: false });

    // 4. Load custom logo
    this.customLogoUrl = this.readStorage(ORG_LOGO_STORAGE_KEY);
    this.initialLogoUrl = this.customLogoUrl;

    // 5. Track changes
    this.orgDisplayNameControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.hasUnsavedChanges =
        (value ?? '').trim() !== this.initialDisplayName.trim() || this.customLogoUrl !== this.initialLogoUrl;
      this.cdr.markForCheck();
    });
  }

  selectPreset(presetId: ThemePreset): void {
    this.activePreset = presetId;
    this.themingService.setPreset(presetId);
    this.cdr.markForCheck();
  }

  selectMode(mode: ThemeMode): void {
    this.activeMode = mode;
    this.themingService.setMode(mode);
    this.cdr.markForCheck();
  }

  onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        this.alertService.alert({
          type: 'File Too Large',
          message: 'The selected image exceeds 2MB. Please select a smaller logo file.'
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.customLogoUrl = reader.result as string;
        this.hasUnsavedChanges = true;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  removeCustomLogo(): void {
    this.customLogoUrl = null;
    this.hasUnsavedChanges = true;
    this.cdr.markForCheck();
  }

  saveBranding(): void {
    const nameVal = (this.orgDisplayNameControl.value ?? '').trim();
    if (nameVal) {
      this.writeStorage(ORG_DISPLAY_NAME_STORAGE_KEY, nameVal);
      this.initialDisplayName = nameVal;
    } else {
      this.removeStorage(ORG_DISPLAY_NAME_STORAGE_KEY);
      this.initialDisplayName = this.settingsService.tenantIdentifier || 'MicroOps 360';
      this.orgDisplayNameControl.setValue(this.initialDisplayName, { emitEvent: false });
    }

    if (this.customLogoUrl) {
      this.writeStorage(ORG_LOGO_STORAGE_KEY, this.customLogoUrl);
      this.initialLogoUrl = this.customLogoUrl;
    } else {
      this.removeStorage(ORG_LOGO_STORAGE_KEY);
      this.initialLogoUrl = null;
    }

    this.hasUnsavedChanges = false;
    this.alertService.alert({
      type: 'Branding Updated',
      message: this.translateService.instant('labels.text.Branding settings saved successfully')
    });
    this.cdr.markForCheck();
  }

  resetToDefaults(): void {
    this.themingService.setPreset('microops-signature');
    this.themingService.setMode('system');
    this.customLogoUrl = null;
    this.removeStorage(ORG_LOGO_STORAGE_KEY);
    this.removeStorage(ORG_DISPLAY_NAME_STORAGE_KEY);

    const defaultName = this.settingsService.tenantIdentifier || 'MicroOps 360';
    this.initialDisplayName = defaultName;
    this.initialLogoUrl = null;
    this.orgDisplayNameControl.setValue(defaultName, { emitEvent: false });
    this.hasUnsavedChanges = false;

    this.alertService.alert({
      type: 'Branding Reset',
      message: this.translateService.instant('labels.text.Appearance settings reset to default')
    });
    this.cdr.markForCheck();
  }

  get displayedLogoUrl(): string {
    return this.customLogoUrl || this.defaultLogoUrl;
  }

  get activePresetOption(): ThemePresetOption {
    return this.presets.find((p) => p.id === this.activePreset) || this.presets[0];
  }

  private readStorage(key: string): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeStorage(key: string, value: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage unavailable
    }
  }

  private removeStorage(key: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage unavailable
    }
  }
}
