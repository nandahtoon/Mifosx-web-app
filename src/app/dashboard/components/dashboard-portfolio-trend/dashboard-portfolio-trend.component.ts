/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DashboardTrendPoint } from '../../models/dashboard.model';

@Component({
  selector: 'mifosx-dashboard-portfolio-trend',
  templateUrl: './dashboard-portfolio-trend.component.html',
  styleUrls: ['./dashboard-portfolio-trend.component.scss'],
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPortfolioTrendComponent {
  @Input({ required: true }) points: DashboardTrendPoint[] = [];
}
