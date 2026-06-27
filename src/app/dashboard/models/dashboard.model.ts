/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export type DashboardTrendDirection = 'up' | 'down' | 'flat';

export type DashboardAlertSeverity = 'critical' | 'high' | 'medium' | 'info';

export interface DashboardKpi {
  title: string;
  value: string;
  helper: string;
  trend: string;
  direction: DashboardTrendDirection;
  route: string;
}

export interface DashboardAlert {
  title: string;
  description: string;
  severity: DashboardAlertSeverity;
}

export interface DashboardTask {
  title: string;
  meta: string;
  priority: string;
}

export interface DashboardRecentLoan {
  id: string;
  client: string;
  product: string;
  amount: string;
  status: string;
}

export interface DashboardMetricRow {
  label: string;
  value: string;
}

export interface DashboardQuickAction {
  label: string;
  route: string;
}

export interface DashboardTrendPoint {
  label: string;
  value: number;
}

export interface DashboardProductMixItem {
  label: string;
  value: number;
  className: string;
}

export interface DashboardViewModel {
  kpis: DashboardKpi[];
  alerts: DashboardAlert[];
  tasks: DashboardTask[];
  recentLoans: DashboardRecentLoan[];
  activities: DashboardMetricRow[];
  parSummary: DashboardMetricRow[];
  quickActions: DashboardQuickAction[];
  portfolioTrend: DashboardTrendPoint[];
  productMix: DashboardProductMixItem[];
}
