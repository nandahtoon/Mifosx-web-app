/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { firstValueFrom } from 'rxjs';
import { SettingsRoutingModule } from './settings-routing.module';
import { I18nService } from '../core/i18n/i18n.service';

describe('Branding route title', () => {
  it('resolves the route title through the existing i18n service in every shipped catalog', async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        SettingsRoutingModule,
        TranslateModule.forRoot()
      ],
      providers: [I18nService]
    });
    const route = TestBed.inject(Router)
      .config.flatMap((entry) => entry.children || [])
      .find((entry) => entry.path === 'branding-and-appearance');
    expect(route).toBeDefined();
    const key = `labels.text.${route.data['title']}`;
    const translate = TestBed.inject(TranslateService);
    const directory = resolve('src/assets/translations');
    for (const file of readdirSync(directory).filter((name) => name.endsWith('.json'))) {
      const catalog = JSON.parse(readFileSync(resolve(directory, file), 'utf8'));
      if (!catalog.labels) continue;
      const locale = file.replace('.json', '');
      translate.setTranslation(locale, catalog);
      await firstValueFrom(translate.use(locale));
      const title = await firstValueFrom(TestBed.inject(I18nService).translate(key));
      expect(title).not.toBe(key);
      expect(title.trim().length).toBeGreaterThan(0);
    }
  });
});
