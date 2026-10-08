/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemingService } from './theming.service';
import { SettingsService } from 'app/settings/settings.service';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { M3IconComponent } from '../m3-ui/m3-icon/m3-icon.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatIconButton,
    MatTooltip,
    M3IconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent implements OnInit {
  private themingService = inject(ThemingService);
  private settingsService = inject(SettingsService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  darkModeOn = false;

  ngOnInit(): void {
    this.darkModeOn = this.themingService.isDarkMode();
    this.themingService.isDark$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((isDark) => {
      this.darkModeOn = isDark;
      this.cdr.markForCheck();
    });
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    this.darkModeOn = !this.darkModeOn;
    this.themingService.setDarkMode(this.darkModeOn);
    this.settingsService.setThemeDarkEnabled(this.darkModeOn);
    this.cdr.markForCheck();
  }
}
