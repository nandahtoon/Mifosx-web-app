/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Custom Models */
import { DashboardAlert } from '../../models/dashboard.model';

@Component({
  selector: 'mifosx-dashboard-alert-card',
  templateUrl: './dashboard-alert-card.component.html',
  styleUrls: ['./dashboard-alert-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAlertCardComponent {
  @Input({ required: true }) alert!: DashboardAlert;
}
