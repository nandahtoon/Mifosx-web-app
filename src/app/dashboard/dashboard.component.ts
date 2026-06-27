/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Custom Modules */
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

type TrendDirection = 'up' | 'down' | 'flat';
type AlertSeverity = 'critical' | 'high' | 'medium' | 'info';

interface DashboardKpi {
  title: string;
  value: string;
  helper: string;
  trend: string;
  direction: TrendDirection;
  route: string;
}

interface DashboardAlert {
  title: string;
  description: string;
  severity: AlertSeverity;
}

interface DashboardTask {
  title: string;
  meta: string;
  priority: string;
}

interface RecentLoan {
  id: string;
  client: string;
  product: string;
  amount: string;
  status: string;
}

@Component({
  selector: 'mifosx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [...STANDALONE_SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  readonly kpis: DashboardKpi[] = [
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
  ];

  readonly alerts: DashboardAlert[] = [
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
      description: 'Dashboard currently uses approved mock data until API mapping is reviewed.',
      severity: 'info'
    }
  ];

  readonly tasks: DashboardTask[] = [
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
  ];

  readonly recentLoans: RecentLoan[] = [
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
  ];
}
