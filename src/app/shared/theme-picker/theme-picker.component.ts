/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** Custom Services */
import { ThemingService, ThemePreset, ThemePresetOption } from '../theme-toggle/theming.service';
import { ThemeStorageService } from './theme-storage.service';
import { Theme } from './theme.model';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * MicroOps Theme Picker component.
 * Displays the 6 canonical MicroOps theme presets.
 */
@Component({
  selector: 'mifosx-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatIconButton,
    MatMenuTrigger,
    MatTooltip,
    FaIconComponent,
    MatMenu,
    MatGridList,
    MatGridTile,
    MatMenuItem
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemePickerComponent implements OnInit {
  private themingService = inject(ThemingService);
  themeStorageService = inject(ThemeStorageService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  activePreset: ThemePreset = 'microops-signature';
  presets: ThemePresetOption[] = [];

  // Legacy Theme model compatibility
  currentTheme: Theme = {
    href: 'microops-signature.css',
    primary: '#0e6251',
    accent: '#0f766e',
    isDark: false,
    isDefault: true
  };
  themes: Theme[] = [];

  ngOnInit(): void {
    this.presets = this.themingService.getAvailablePresets();
    this.activePreset = this.themingService.getPreset();

    // Map presets to legacy theme array for backwards compatibility
    this.themes = this.presets.map((p) => ({
      href: `${p.id}.css`,
      primary: p.primaryLight,
      accent: p.accentLight,
      isDark: false,
      isDefault: p.id === 'microops-signature'
    }));

    this.themingService.preset$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((preset) => {
      this.activePreset = preset;
      const found = this.themes.find((t) => t.href === `${preset}.css`);
      if (found) {
        this.currentTheme = found;
      }
      this.cdr.markForCheck();
    });
  }

  selectPreset(preset: ThemePresetOption): void {
    this.activePreset = preset.id;
    this.themingService.setPreset(preset.id);
    const legacyTheme: Theme = {
      href: `${preset.id}.css`,
      primary: preset.primaryLight,
      accent: preset.accentLight,
      isDark: false,
      isDefault: preset.id === 'microops-signature'
    };
    this.currentTheme = legacyTheme;
    this.themeStorageService.storeTheme(legacyTheme);
    this.cdr.markForCheck();
  }

  installTheme(theme: Theme): void {
    const presetId = theme.href.replace('.css', '') as ThemePreset;
    if (this.presets.some((p) => p.id === presetId)) {
      this.themingService.setPreset(presetId);
    }
    this.currentTheme = theme;
    this.themeStorageService.storeTheme(theme);
    this.cdr.markForCheck();
  }
}
