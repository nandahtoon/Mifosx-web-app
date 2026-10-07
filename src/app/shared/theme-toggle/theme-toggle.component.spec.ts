/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemingService } from './theming.service';
import { SettingsService } from 'app/settings/settings.service';
import { TranslateModule } from '@ngx-translate/core';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themingService: ThemingService;
  let settingsService: SettingsService;

  beforeEach(async () => {
    localStorage.clear();
    document.body.className = '';

    await TestBed.configureTestingModule({
      imports: [
        ThemeToggleComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        ThemingService,
        {
          provide: SettingsService,
          useValue: {
            themeDarkEnabled: false,
            setThemeDarkEnabled: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    themingService = TestBed.inject(ThemingService);
    settingsService = TestBed.inject(SettingsService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  it('should create and initialize darkMode state', () => {
    expect(component).toBeTruthy();
    expect(typeof component.darkModeOn).toBe('boolean');
  });

  it('should toggle theme when toggleTheme is called', () => {
    const initial = component.darkModeOn;
    component.toggleTheme();
    expect(component.darkModeOn).toBe(!initial);
    expect(settingsService.setThemeDarkEnabled).toHaveBeenCalledWith(!initial);
  });
});
