/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

/** Custom Modules */
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/** Custom Services */
import { DashboardFacadeService } from './services/dashboard-facade.service';

@Component({
  selector: 'mifosx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [...STANDALONE_SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly dashboardFacade = inject(DashboardFacadeService);

  readonly dashboard$ = this.dashboardFacade.getDashboardViewModel();
}
