/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Injectable, inject } from '@angular/core';

/** rxjs Imports */
import { Observable, catchError, map, of } from 'rxjs';

/** Custom Mappers */
import { mapTotalPortfolioValue } from '../mappers/dashboard-total-portfolio.mapper';

/** Custom Models */
import { DashboardKpi, DashboardState, DashboardViewModel } from '../models/dashboard.model';

/** Custom Services */
import { DashboardApiService } from './dashboard-api.service';
import { DashboardReportConfigService } from './dashboard-report-config.service';

@Injectable({ providedIn: 'root' })
export class DashboardFacadeService {
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly dashboardReportConfig = inject(DashboardReportConfigService);

  getDashboardState(): Observable<DashboardState> {
    const reportConfig = this.dashboardReportConfig.getTotalPortfolioReportConfig();

    if (!reportConfig.reportName) {
      return of<DashboardState>({
        status: 'empty',
        data: this.buildNonFinancialDashboard()
      });
    }

    return this.dashboardApi.runReport(reportConfig.reportName, reportConfig.params).pipe(
      map((response): DashboardState => {
        const reportValue = mapTotalPortfolioValue(response);

        if (!reportValue) {
          return {
            status: 'empty',
            data: this.buildNonFinancialDashboard()
          };
        }

        return {
          status: 'ready',
          data: this.buildLiveDashboard(this.buildTotalPortfolioKpi(reportConfig.reportName!, reportValue))
        };
      }),
      catchError(() =>
        of<DashboardState>({
          status: 'error',
          data: this.buildNonFinancialDashboard()
        })
      )
    );
  }

  hasApiIntegrationReady(): boolean {
    return Boolean(this.dashboardApi);
  }

  hasTotalPortfolioReportConfigured(): boolean {
    return Boolean(this.dashboardReportConfig.getTotalPortfolioReportConfig().reportName);
  }

  private buildTotalPortfolioKpi(reportName: string, reportValue: string): DashboardKpi {
    return {
      title: 'Total Portfolio',
      value: reportValue,
      helper: `Report: ${reportName}`,
      trend: 'Loaded from report',
      direction: 'flat',
      route: '/reports'
    };
  }

  private buildNonFinancialDashboard(): DashboardViewModel {
    return {
      kpis: [],
      alerts: [],
      tasks: [],
      recentLoans: [],
      activities: [],
      parSummary: [],
      quickActions: [
        { label: 'Register Client', route: '/clients/create' },
        { label: 'Find Client or Account', route: '/search' },
        { label: 'Group Collection', route: '/collections/collection-sheet' },
        { label: 'Individual Collection', route: '/collections/individual-collection-sheet' },
        { label: 'Loan Approval', route: '/checker-inbox-and-tasks/loan-approval' },
        { label: 'Loan Disbursal', route: '/checker-inbox-and-tasks/loan-disbursal' },
        { label: 'Checker Inbox', route: '/checker-inbox-and-tasks/checker-inbox' },
        { label: 'Reports', route: '/reports' }
      ],
      portfolioTrend: [],
      productMix: []
    };
  }

  private buildLiveDashboard(totalPortfolioKpi: DashboardKpi): DashboardViewModel {
    return {
      ...this.buildNonFinancialDashboard(),
      kpis: [totalPortfolioKpi]
    };
  }
}
