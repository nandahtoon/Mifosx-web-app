/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { ChangeDetectionStrategy, Component, inject, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ExternalIdentifierComponent } from '../../../../shared/external-identifier/external-identifier.component';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Office View General Tab — Post-v0.1.0 M01 Comprehensive Office Master Data Surface (Issue #123)
 * Displays core Fineract identity alongside administrative geography, physical address,
 * coordinates, and service area status. Explicitly renders UNAVAILABLE or NOT CONFIGURED
 * for unmapped fields rather than inventing synthetic coordinates or data.
 */
@Component({
  selector: 'mifosx-general-tab',
  templateUrl: './general-tab.component.html',
  styleUrls: ['./general-tab.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    ExternalIdentifierComponent,
    DateFormatPipe,
    FaIconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralTabComponent {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  /** Office data from Fineract resolver */
  officeData: any = {};

  constructor() {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: { office: any }) => {
      this.officeData = data.office || {};
      this.cdr.markForCheck();
    });
  }

  get isHeadOffice(): boolean {
    return !this.officeData?.parentId || this.officeData?.id === 1;
  }

  get officeType(): string {
    return this.isHeadOffice ? 'HEAD_OFFICE' : 'SUBORDINATE_OFFICE';
  }

  get country(): string | null {
    return this.officeData?.country || this.officeData?.countryName || null;
  }

  get stateProvince(): string | null {
    return this.officeData?.stateProvince || this.officeData?.region || null;
  }

  get township(): string | null {
    return this.officeData?.township || null;
  }

  get pcode(): string | null {
    return this.officeData?.pcode || null;
  }

  get addressLine1(): string | null {
    return this.officeData?.addressLine1 || null;
  }

  get addressLine2(): string | null {
    return this.officeData?.addressLine2 || null;
  }

  get city(): string | null {
    return this.officeData?.city || null;
  }

  get postalCode(): string | null {
    return this.officeData?.postalCode || null;
  }

  get latitude(): number | string | null {
    return this.officeData?.latitude != null ? this.officeData.latitude : null;
  }

  get longitude(): number | string | null {
    return this.officeData?.longitude != null ? this.officeData.longitude : null;
  }

  get geolocationPrecision(): string | null {
    return this.officeData?.geolocationPrecision || null;
  }

  get homeTownship(): string | null {
    return this.officeData?.homeTownship || null;
  }

  get bookingEnabled(): boolean | null {
    return typeof this.officeData?.bookingEnabled === 'boolean' ? this.officeData.bookingEnabled : null;
  }

  get capacityPolicyRef(): string | null {
    return this.officeData?.capacityPolicyRef || null;
  }
}
