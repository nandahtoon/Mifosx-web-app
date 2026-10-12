/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Browser-only presentation preferences, isolated by backend and tenant. */
@Injectable({ providedIn: 'root' })
export class AppearanceStorageService {
  private scopeChanged = new Subject<void>();
  readonly scopeChanges$ = this.scopeChanged.asObservable();

  notifyScopeChanged(): void {
    this.scopeChanged.next();
  }

  private scopedKey(key: string): string {
    const server = localStorage.getItem('mifosXServerURL') || environment.baseApiUrl || '';
    const tenant = localStorage.getItem('mifosXTenantIdentifier') || environment.fineractPlatformTenantId || '';
    return `${key}:${encodeURIComponent(
      JSON.stringify([
        server,
        tenant
      ])
    )}`;
  }

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(this.scopedKey(key));
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(this.scopedKey(key), value);
      return true;
    } catch {
      return false;
    }
  }

  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(this.scopedKey(key));
      return true;
    } catch {
      return false;
    }
  }
}
