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

/** Custom Components */
import { DashboardActivitySummaryComponent } from './components/dashboard-activity-summary/dashboard-activity-summary.component';
import { DashboardAlertCardComponent } from './components/dashboard-alert-card/dashboard-alert-card.component';
import { DashboardKpiCardComponent } from './components/dashboard-kpi-card/dashboard-kpi-card.component';
import { DashboardParSummaryComponent } from './components/dashboard-par-summary/dashboard-par-summary.component';
import { DashboardPortfolioTrendComponent } from './components/dashboard-portfolio-trend/dashboard-portfolio-trend.component';
import { DashboardProductMixComponent } from './components/dashboard-product-mix/dashboard-product-mix.component';
import { DashboardQuickActionsComponent } from './components/dashboard-quick-actions/dashboard-quick-actions.component';
import { DashboardRecentLoansComponent } from './components/dashboard-recent-loans/dashboard-recent-loans.component';
import { DashboardTaskCardComponent } from './components/dashboard-task-card/dashboard-task-card.component';

/** Custom Services */
import { DashboardFacadeService } from './services/dashboard-facade.service';

@Component({
  selector: 'mifosx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    DashboardActivitySummaryComponent,
    DashboardAlertCardComponent,
    DashboardKpiCardComponent,
    DashboardParSummaryComponent,
    DashboardPortfolioTrendComponent,
    DashboardProductMixComponent,
    DashboardQuickActionsComponent,
    DashboardRecentLoansComponent,
    DashboardTaskCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly dashboardFacade = inject(DashboardFacadeService);

  dashboardState$ = this.dashboardFacade.getDashboardState();

  reloadDashboard(): void {
    this.dashboardState$ = this.dashboardFacade.getDashboardState();
  }
}
