/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppearanceStorageService } from './appearance-storage.service';

export const BRANDING_STORAGE_KEY = 'microopsBranding';

/** Shared presentation identity for the branding studio and unauthenticated login. */
@Injectable({ providedIn: 'root' })
export class BrandingService {
  private storage = inject(AppearanceStorageService);

  get defaultName(): string {
    return environment.brandName;
  }

  get defaultLogo(): string {
    return environment.tenantLogoUrl;
  }

  get defaultDarkLogo(): string {
    return environment.tenantLogoUrlDark;
  }

  read(): { name: string; logo: string | null } {
    let stored: { name?: unknown; logo?: unknown } = {};
    try {
      stored = JSON.parse(this.storage.getItem(BRANDING_STORAGE_KEY) || '{}') || {};
    } catch {
      // Malformed browser preferences must not prevent sign-in.
    }
    return {
      name: (typeof stored.name === 'string' && stored.name.trim()) || this.defaultName,
      logo: (typeof stored.logo === 'string' && stored.logo.trim()) || null
    };
  }
}
