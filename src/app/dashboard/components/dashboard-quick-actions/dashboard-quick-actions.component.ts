/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { DashboardQuickAction } from '../../models/dashboard.model';

@Component({
  selector: 'mifosx-dashboard-quick-actions',
  templateUrl: './dashboard-quick-actions.component.html',
  styleUrls: ['./dashboard-quick-actions.component.scss'],
  imports: [...STANDALONE_SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardQuickActionsComponent {
  @Input({ required: true }) actions: DashboardQuickAction[] = [];
}
