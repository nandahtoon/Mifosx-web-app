/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ApplicationRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemePreset =
  | 'microops-signature'
  | 'ocean-corporate'
  | 'rich-purple'
  | 'corporate-navy'
  | 'calm-productivity'
  | 'emerald-banking';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemePresetOption {
  id: ThemePreset;
  name: string;
  description: string;
  primaryLight: string;
  accentLight: string;
  primaryDark: string;
  accentDark: string;
}

export const THEME_PRESETS: ThemePresetOption[] = [
  {
    id: 'microops-signature',
    name: 'MicroOps Signature',
    description: 'Signature balanced petrol teal & operational cyan',
    primaryLight: '#0e6251',
    accentLight: '#0f766e',
    primaryDark: '#2ec4b6',
    accentDark: '#14b8a6'
  },
  {
    id: 'ocean-corporate',
    name: 'Ocean Corporate',
    description: 'High-contrast institutional ocean azure',
    primaryLight: '#0284c7',
    accentLight: '#0369a1',
    primaryDark: '#38bdf8',
    accentDark: '#0284c7'
  },
  {
    id: 'rich-purple',
    name: 'Rich Purple',
    description: 'Modern royal purple & violet financial elegance',
    primaryLight: '#6d28d9',
    accentLight: '#7c3aed',
    primaryDark: '#a78bfa',
    accentDark: '#8b5cf6'
  },
  {
    id: 'corporate-navy',
    name: 'Corporate Navy',
    description: 'Classic institutional midnight navy',
    primaryLight: '#1e40af',
    accentLight: '#1d4ed8',
    primaryDark: '#60a5fa',
    accentDark: '#3b82f6'
  },
  {
    id: 'calm-productivity',
    name: 'Calm Productivity',
    description: 'Focused slate steel & neutral mineral tones',
    primaryLight: '#475569',
    accentLight: '#334155',
    primaryDark: '#94a3b8',
    accentDark: '#64748b'
  },
  {
    id: 'emerald-banking',
    name: 'Emerald Banking',
    description: 'Prestige botanical emerald & growth green',
    primaryLight: '#047857',
    accentLight: '#059669',
    primaryDark: '#34d399',
    accentDark: '#10b981'
  }
];

const PRESET_STORAGE_KEY = 'microopsThemePreset';
const MODE_STORAGE_KEY = 'microopsThemeMode';
const LEGACY_STORAGE_KEY = 'mifosXThemeDarkEnabled';

@Injectable({
  providedIn: 'root'
})
export class ThemingService {
  private ref = inject(ApplicationRef, { optional: true });

  private currentPreset: ThemePreset = 'microops-signature';
  private currentMode: ThemeMode = 'system';
  private darkModeOn = false;

  themes = [
    'dark-theme',
    'light-theme'
  ];
  theme = new BehaviorSubject<string>('light-theme');

  preset$ = new BehaviorSubject<ThemePreset>('microops-signature');
  mode$ = new BehaviorSubject<ThemeMode>('system');
  isDark$ = new BehaviorSubject<boolean>(false);

  private mediaQueryListener?: (e: MediaQueryListEvent) => void;

  constructor() {
    this.initTheme();
    this.setupSystemListener();
  }

  private initTheme(): void {
    // 1. Preset from storage or default
    const savedPreset = this.readStorage<ThemePreset>(PRESET_STORAGE_KEY);
    if (savedPreset && THEME_PRESETS.some((p) => p.id === savedPreset)) {
      this.currentPreset = savedPreset;
    } else {
      this.currentPreset = 'microops-signature';
    }

    // 2. Mode from storage or legacy fallback
    const savedMode = this.readStorage<ThemeMode>(MODE_STORAGE_KEY);
    if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
      this.currentMode = savedMode;
    } else {
      const legacyDark = this.readStorage<boolean>(LEGACY_STORAGE_KEY);
      if (typeof legacyDark === 'boolean') {
        this.currentMode = legacyDark ? 'dark' : 'light';
      } else {
        this.currentMode = 'system';
      }
    }

    this.preset$.next(this.currentPreset);
    this.mode$.next(this.currentMode);
    this.applyTheme();
  }

  private setupSystemListener(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        this.mediaQueryListener = () => {
          if (this.currentMode === 'system') {
            this.applyTheme();
            this.ref?.tick();
          }
        };

        if (mql.addEventListener) {
          mql.addEventListener('change', this.mediaQueryListener);
        } else if (mql.addListener) {
          mql.addListener(this.mediaQueryListener);
        }
      } catch {
        // matchMedia not fully implemented in some test runners
      }
    }
  }

  private checkSystemDark(): boolean {
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {
        return false;
      }
    }
    return false;
  }

  private calculateIsDark(): boolean {
    if (this.currentMode === 'dark') {
      return true;
    }
    if (this.currentMode === 'light') {
      return false;
    }
    return this.checkSystemDark();
  }

  private applyTheme(): void {
    const isDark = this.calculateIsDark();
    this.darkModeOn = isDark;

    if (typeof document !== 'undefined' && document.body) {
      const body = document.body;

      // 1. Update preset class
      THEME_PRESETS.forEach((preset) => {
        body.classList.remove(`theme-${preset.id}`);
      });
      body.classList.add(`theme-${this.currentPreset}`);

      // 2. Update mode class
      if (isDark) {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
      } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
      }
    }

    const themeClass = isDark ? 'dark-theme' : 'light-theme';
    this.theme.next(themeClass);
    this.isDark$.next(isDark);
  }

  // Public API

  getPreset(): ThemePreset {
    return this.currentPreset;
  }

  setPreset(preset: ThemePreset): void {
    if (!THEME_PRESETS.some((p) => p.id === preset)) {
      return;
    }
    this.currentPreset = preset;
    this.writeStorage(PRESET_STORAGE_KEY, preset);
    this.preset$.next(preset);
    this.applyTheme();
  }

  getMode(): ThemeMode {
    return this.currentMode;
  }

  setMode(mode: ThemeMode): void {
    if (mode !== 'light' && mode !== 'dark' && mode !== 'system') {
      return;
    }
    this.currentMode = mode;
    this.writeStorage(MODE_STORAGE_KEY, mode);
    this.writeStorage(LEGACY_STORAGE_KEY, this.calculateIsDark());
    this.mode$.next(mode);
    this.applyTheme();
  }

  toggleMode(): void {
    // Cycles Light -> Dark -> System
    if (this.currentMode === 'light') {
      this.setMode('dark');
    } else if (this.currentMode === 'dark') {
      this.setMode('system');
    } else {
      this.setMode('light');
    }
  }

  isDarkMode(): boolean {
    return this.calculateIsDark();
  }

  setDarkMode(isDarkMode: boolean): void {
    this.setMode(isDarkMode ? 'dark' : 'light');
  }

  setInitialDarkMode(): void {
    this.applyTheme();
  }

  getAvailablePresets(): ThemePresetOption[] {
    return THEME_PRESETS;
  }

  private readStorage<T>(key: string): T | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    try {
      const val = localStorage.getItem(key);
      if (val === null) {
        return null;
      }
      try {
        return JSON.parse(val) as T;
      } catch {
        return val as unknown as T;
      }
    } catch {
      return null;
    }
  }

  private writeStorage(key: string, value: unknown): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Storage unavailable or disabled
    }
  }
}
