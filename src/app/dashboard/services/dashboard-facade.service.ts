/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Injectable } from '@angular/core';

/** rxjs Imports */
import { Observable, of } from 'rxjs';

/** Custom Models */
import { DashboardViewModel } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardFacadeService {
  getDashboardViewModel(): Observable<DashboardViewModel> {
    return of({
      kpis: [
        {
          title: 'Total Portfolio',
          value: 'MMK 2,458.75M',
          helper: 'Outstanding portfolio',
          trend: '+12.5% vs last month',
          direction: 'up',
          route: '/reports'
        },
        {
          title: 'Active Loans',
          value: '18,542',
          helper: 'Open loan accounts',
          trend: '+8.2% vs last month',
          direction: 'up',
          route: '/search'
        },
        {
          title: 'Collections Today',
          value: 'MMK 126.75M',
          helper: 'Posted repayments',
          trend: '+15.8% vs yesterday',
          direction: 'up',
          route: '/collections'
        },
        {
          title: 'PAR > 30 Days',
          value: '3.45%',
          helper: 'Portfolio at risk',
          trend: '-0.6% vs last month',
          direction: 'down',
          route: '/reports'
        },
        {
          title: 'Pending Approvals',
          value: '12',
          helper: 'Checker inbox items',
          trend: '3 new today',
          direction: 'flat',
          route: '/checker-inbox-and-tasks'
        },
        {
          title: 'Cash Balance',
          value: 'MMK 412.80M',
          helper: 'Available branch cash',
          trend: '+7.3% vs yesterday',
          direction: 'up',
          route: '/accounting'
        }
      ],
      alerts: [
        {
          title: '18 loans due today',
          description: 'Prioritize collection follow-up before close of business.',
          severity: 'high'
        },
        {
          title: '12 approvals pending',
          description: 'Loan, client, and transaction approvals need review.',
          severity: 'medium'
        },
        {
          title: '3 clients need attention',
          description: 'Arrears or missing visit activity detected.',
          severity: 'critical'
        },
        {
          title: 'System notice',
          description: 'Dashboard uses isolated mock data until API mapping is reviewed.',
          severity: 'info'
        }
      ],
      tasks: [
        {
          title: 'Approve loan application',
          meta: 'LN0002458 - Daw Hla Hla',
          priority: 'High'
        },
        {
          title: 'Review collection exception',
          meta: 'Receipt mismatch - Branch 03',
          priority: 'Medium'
        },
        {
          title: 'Follow up client visit',
          meta: 'U Kyaw Soe - overdue visit',
          priority: 'Low'
        }
      ],
      recentLoans: [
        {
          id: 'LN0002458',
          client: 'Daw Hla Hla',
          product: 'Individual Loan',
          amount: 'MMK 5,000,000',
          status: 'Active'
        },
        {
          id: 'LN0002457',
          client: 'U Win Naing',
          product: 'Group Loan',
          amount: 'MMK 2,500,000',
          status: 'Pending'
        },
        {
          id: 'LN0002456',
          client: 'Daw Mya Mya',
          product: 'Agriculture Loan',
          amount: 'MMK 3,200,000',
          status: 'Active'
        }
      ]
    });
  }
}
