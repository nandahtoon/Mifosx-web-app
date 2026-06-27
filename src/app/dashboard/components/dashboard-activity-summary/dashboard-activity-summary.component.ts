/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { DashboardMetricRow } from '../../models/dashboard.model';

@Component({
  selector: 'mifosx-dashboard-activity-summary',
  templateUrl: './dashboard-activity-summary.component.html',
  styleUrls: ['./dashboard-activity-summary.component.scss'],
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardActivitySummaryComponent {
  @Input({ required: true }) activities: DashboardMetricRow[] = [];
}
