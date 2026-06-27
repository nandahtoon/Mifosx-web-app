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
import { Observable, of } from 'rxjs';

/** Custom Models */
import { DashboardState, DashboardViewModel } from '../models/dashboard.model';

/** Custom Services */
import { DashboardApiService } from './dashboard-api.service';

@Injectable({ providedIn: 'root' })
export class DashboardFacadeService {
  private readonly dashboardApi = inject(DashboardApiService);

  getDashboardState(): Observable<DashboardState> {
    return of({
      status: 'ready',
      data: this.buildMockDashboard()
    });
  }

  /**
   * API integration seam for Sprint 3+.
   *
   * The API service is intentionally injected but not called for production data yet,
   * because exact report names and parameters must be approved first.
   */
  hasApiIntegrationReady(): boolean {
    return Boolean(this.dashboardApi);
  }

  private buildMockDashboard(): DashboardViewModel {
    return {
      kpis: [
        { title: 'Total Portfolio', value: 'MMK 2,458.75M', helper: 'Outstanding portfolio', trend: '+12.5% vs last month', direction: 'up', route: '/reports' },
        { title: 'Active Loans', value: '18,542', helper: 'Open loan accounts', trend: '+8.2% vs last month', direction: 'up', route: '/search' },
        { title: 'Collections Today', value: 'MMK 126.75M', helper: 'Posted repayments', trend: '+15.8% vs yesterday', direction: 'up', route: '/collections' },
        { title: 'PAR > 30 Days', value: '3.45%', helper: 'Portfolio at risk', trend: '-0.6% vs last month', direction: 'down', route: '/reports' },
        { title: 'Pending Approvals', value: '12', helper: 'Checker inbox items', trend: '3 new today', direction: 'flat', route: '/checker-inbox-and-tasks' },
        { title: 'Cash Balance', value: 'MMK 412.80M', helper: 'Available branch cash', trend: '+7.3% vs yesterday', direction: 'up', route: '/accounting' }
      ],
      alerts: [
        { title: '18 loans due today', description: 'Prioritize collection follow-up before close of business.', severity: 'high' },
        { title: '12 approvals pending', description: 'Loan, client, and transaction approvals need review.', severity: 'medium' },
        { title: '3 clients need attention', description: 'Arrears or missing visit activity detected.', severity: 'critical' },
        { title: 'System notice', description: 'Dashboard uses isolated mock data until API mapping is reviewed.', severity: 'info' }
      ],
      tasks: [
        { title: 'Approve loan application', meta: 'LN0002458 - Daw Hla Hla', priority: 'High' },
        { title: 'Review collection exception', meta: 'Receipt mismatch - Branch 03', priority: 'Medium' },
        { title: 'Follow up client visit', meta: 'U Kyaw Soe - overdue visit', priority: 'Low' }
      ],
      recentLoans: [
        { id: 'LN0002458', client: 'Daw Hla Hla', product: 'Individual Loan', amount: 'MMK 5,000,000', status: 'Active' },
        { id: 'LN0002457', client: 'U Win Naing', product: 'Group Loan', amount: 'MMK 2,500,000', status: 'Pending' },
        { id: 'LN0002456', client: 'Daw Mya Mya', product: 'Agriculture Loan', amount: 'MMK 3,200,000', status: 'Active' }
      ],
      activities: [
        { label: 'Disbursements', value: '8' },
        { label: 'Collections', value: '126' },
        { label: 'New Clients', value: '32' },
        { label: 'Field Visits', value: '47' }
      ],
      parSummary: [
        { label: 'PAR 1 to 30', value: '2.10%' },
        { label: 'PAR 31 to 90', value: '1.05%' },
        { label: 'PAR over 90', value: '0.30%' }
      ],
      quickActions: [
        { label: 'New Client', route: '/clients/create' },
        { label: 'New Loan', route: '/search' },
        { label: 'Collection', route: '/collections' },
        { label: 'Reports', route: '/reports' }
      ],
      portfolioTrend: [
        { label: 'Jan', value: 34 },
        { label: 'Feb', value: 48 },
        { label: 'Mar', value: 42 },
        { label: 'Apr', value: 62 },
        { label: 'May', value: 58 },
        { label: 'Jun', value: 76 },
        { label: 'Jul', value: 84 }
      ],
      productMix: [
        { label: 'Individual Loan', value: 58, className: 'primary' },
        { label: 'Group Loan', value: 25, className: 'success' },
        { label: 'Agriculture Loan', value: 17, className: 'warning' }
      ]
    };
  }
}
