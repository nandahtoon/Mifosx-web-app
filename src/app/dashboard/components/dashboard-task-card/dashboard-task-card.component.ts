/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DashboardTask } from '../../models/dashboard.model';

@Component({
  selector: 'mifosx-dashboard-task-card',
  templateUrl: './dashboard-task-card.component.html',
  styleUrls: ['./dashboard-task-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardTaskCardComponent {
  @Input({ required: true }) task!: DashboardTask;
}
