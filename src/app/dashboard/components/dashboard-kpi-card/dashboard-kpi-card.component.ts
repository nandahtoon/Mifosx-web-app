/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Custom Modules */
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/** Custom Models */
import { DashboardKpi } from '../../models/dashboard.model';

@Component({
  selector: 'mifosx-dashboard-kpi-card',
  templateUrl: './dashboard-kpi-card.component.html',
  styleUrls: ['./dashboard-kpi-card.component.scss'],
  imports: [...STANDALONE_SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardKpiCardComponent {
  @Input({ required: true }) kpi!: DashboardKpi;
}
