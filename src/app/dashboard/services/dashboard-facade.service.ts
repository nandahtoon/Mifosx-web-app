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
import { Observable, catchError, forkJoin, map, of } from 'rxjs';

/** Environment */
import { environment } from 'environments/environment';

/** Core Services */
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { TasksService } from 'app/tasks/tasks.service';

/** Custom Mappers */
import { mapTotalPortfolioValue } from '../mappers/dashboard-total-portfolio.mapper';

/** Custom Models */
import {
  DashboardAlert,
  DashboardKpi,
  DashboardMetricRow,
  DashboardQuickAction,
  DashboardRecentLoan,
  DashboardState,
  DashboardTask,
  DashboardViewModel
} from '../models/dashboard.model';

/** Custom Services */
import { DashboardApiService } from './dashboard-api.service';
import { DashboardReportConfigService } from './dashboard-report-config.service';

@Injectable({ providedIn: 'root' })
export class DashboardFacadeService {
  private readonly dashboardApi = inject(DashboardApiService);
  private readonly dashboardReportConfig = inject(DashboardReportConfigService);
  private readonly tasksService = inject(TasksService, { optional: true });
  private readonly authenticationService = inject(AuthenticationService, { optional: true });

  getDashboardState(): Observable<DashboardState> {
    if (this.authenticationService && !this.authenticationService.isAuthenticated()) {
      return of<DashboardState>({
        status: 'unauthorized',
        data: null,
        message: 'Authentication is required to view operational workspace data.'
      });
    }

    const reportConfig = this.dashboardReportConfig.getTotalPortfolioReportConfig();

    const report$: Observable<{ success: boolean; data?: any; error?: any } | null> = reportConfig.reportName
      ? this.dashboardApi.runReport(reportConfig.reportName, reportConfig.params).pipe(
          map((res) => ({ success: true, data: res })),
          catchError((err) => of({ success: false, error: err }))
        )
      : of(null);

    const makerCheckers$ = this.tasksService
      ? this.tasksService.getMakerCheckerData().pipe(catchError(() => of(null)))
      : of(null);

    const rescheduleLoans$ = this.tasksService
      ? this.tasksService.getPendingRescheduleLoans().pipe(catchError(() => of(null)))
      : of(null);

    const loansToBeApproved$ = this.tasksService
      ? this.tasksService.getAllLoansToBeApproved().pipe(catchError(() => of(null)))
      : of(null);

    const loansToBeDisbursed$ = this.tasksService
      ? this.tasksService.getAllLoansToBeDisbursed().pipe(catchError(() => of(null)))
      : of(null);

    const groupedClients$ = this.tasksService
      ? this.tasksService.getGroupedClientsData().pipe(catchError(() => of(null)))
      : of(null);

    const savingsToBeApproved$ = this.tasksService
      ? this.tasksService.getAllSavingsToBeApproved().pipe(catchError(() => of(null)))
      : of(null);

    const recentLoans$ = this.dashboardApi.getRecentLoans
      ? this.dashboardApi.getRecentLoans(5).pipe(catchError(() => of(null)))
      : of(null);

    return forkJoin({
      report: report$,
      makerCheckers: makerCheckers$,
      rescheduleLoans: rescheduleLoans$,
      loansToBeApproved: loansToBeApproved$,
      loansToBeDisbursed: loansToBeDisbursed$,
      groupedClients: groupedClients$,
      savingsToBeApproved: savingsToBeApproved$,
      recentLoans: recentLoans$
    }).pipe(
      map(
        ({
          report,
          makerCheckers,
          rescheduleLoans,
          loansToBeApproved,
          loansToBeDisbursed,
          groupedClients,
          savingsToBeApproved,
          recentLoans
        }): DashboardState => {
          if (report && !report.success) {
            return {
              status: 'error',
              data: this.buildNonFinancialDashboard(),
              message: 'Portfolio summary report could not be loaded.'
            };
          }

          const kpis: DashboardKpi[] = [];
          if (report && report.success) {
            const reportValue = mapTotalPortfolioValue(report.data);
            if (reportValue && reportConfig.reportName) {
              kpis.push(this.buildTotalPortfolioKpi(reportConfig.reportName, reportValue));
            }
          }

          const tasks: DashboardTask[] = [];
          const mcItems = Array.isArray(makerCheckers) ? makerCheckers : [];
          if (mcItems.length > 0) {
            tasks.push({
              title: 'Maker-Checker Queue',
              meta: `${mcItems.length} item${mcItems.length === 1 ? '' : 's'} awaiting checker review`,
              priority: 'Action Required',
              route: '/checker-inbox-and-tasks/checker-inbox'
            });
          }

          const rescheduleItems = Array.isArray(rescheduleLoans) ? rescheduleLoans : [];
          if (rescheduleItems.length > 0) {
            tasks.push({
              title: 'Loan Reschedule Requests',
              meta: `${rescheduleItems.length} loan${rescheduleItems.length === 1 ? '' : 's'} pending decision`,
              priority: 'Pending Decision',
              route: '/checker-inbox-and-tasks/reschedule-loan'
            });
          }

          const alerts: DashboardAlert[] = [];

          const loansApprCount = this.extractCount(loansToBeApproved);
          if (loansApprCount > 0) {
            alerts.push({
              title: 'Loans Pending Approval',
              description: `${loansApprCount} loan application${loansApprCount === 1 ? '' : 's'} awaiting approval`,
              severity: loansApprCount > 5 ? 'critical' : 'high',
              route: '/checker-inbox-and-tasks/loan-approval'
            });
          }

          const loansDisbCount = this.extractCount(loansToBeDisbursed);
          if (loansDisbCount > 0) {
            alerts.push({
              title: 'Loans Awaiting Disbursal',
              description: `${loansDisbCount} approved loan${loansDisbCount === 1 ? '' : 's'} ready for disbursement`,
              severity: 'medium',
              route: '/checker-inbox-and-tasks/loan-disbursal'
            });
          }

          const clientsPendingCount = this.extractCount(groupedClients);
          if (clientsPendingCount > 0) {
            alerts.push({
              title: 'Pending Client Approvals',
              description: `${clientsPendingCount} client application${clientsPendingCount === 1 ? '' : 's'} pending activation`,
              severity: 'medium',
              route: '/checker-inbox-and-tasks/client-approval'
            });
          }

          const savingsApprCount = this.extractCount(savingsToBeApproved);
          if (savingsApprCount > 0) {
            alerts.push({
              title: 'Savings Accounts Pending Approval',
              description: `${savingsApprCount} savings account${savingsApprCount === 1 ? '' : 's'} awaiting approval`,
              severity: 'info',
              route: '/checker-inbox-and-tasks'
            });
          }

          const recentLoanList = this.mapRecentLoans(recentLoans);

          const activities: DashboardMetricRow[] = [];
          if (loansApprCount > 0) {
            activities.push({ label: 'Loans Pending Approval', value: String(loansApprCount) });
          }
          if (loansDisbCount > 0) {
            activities.push({ label: 'Loans Ready for Disbursal', value: String(loansDisbCount) });
          }
          if (clientsPendingCount > 0) {
            activities.push({ label: 'Pending Client Activations', value: String(clientsPendingCount) });
          }
          if (mcItems.length > 0) {
            activities.push({ label: 'Maker-Checker Queue Items', value: String(mcItems.length) });
          }

          const quickActions = this.buildQuickActions();

          const viewModel: DashboardViewModel = {
            kpis,
            alerts,
            tasks,
            recentLoans: recentLoanList,
            activities,
            parSummary: [],
            quickActions,
            portfolioTrend: [],
            productMix: []
          };

          const hasOperationalData =
            kpis.length > 0 ||
            alerts.length > 0 ||
            tasks.length > 0 ||
            recentLoanList.length > 0 ||
            activities.length > 0;

          return {
            status: hasOperationalData ? 'ready' : 'empty',
            data: viewModel
          };
        }
      ),
      catchError(() =>
        of<DashboardState>({
          status: 'error',
          data: this.buildNonFinancialDashboard(),
          message: 'Operations workspace could not load.'
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

  private extractCount(response: any): number {
    if (!response) {
      return 0;
    }
    if (typeof response.totalFilteredRecords === 'number') {
      return response.totalFilteredRecords;
    }
    if (Array.isArray(response.pageItems)) {
      return response.pageItems.length;
    }
    if (Array.isArray(response)) {
      return response.length;
    }
    return 0;
  }

  private mapRecentLoans(response: any): DashboardRecentLoan[] {
    if (!response) {
      return [];
    }
    const items: any[] = Array.isArray(response)
      ? response
      : Array.isArray(response.pageItems)
        ? response.pageItems
        : [];

    return items.slice(0, 5).map((loan: any): DashboardRecentLoan => {
      const currency = loan.currency?.displaySymbol || loan.currency?.code || '';
      const principalAmount =
        loan.principal != null
          ? `${currency} ${Number(loan.principal).toLocaleString()}`.trim()
          : loan.amount != null
            ? `${currency} ${Number(loan.amount).toLocaleString()}`.trim()
            : '-';

      const statusName = loan.status?.value || loan.status?.code || 'Active';
      const clientId = loan.clientId || loan.client?.id;
      const loanRoute = clientId
        ? `/clients/${clientId}/loans-accounts/${loan.id}/general`
        : `/checker-inbox-and-tasks/loan-approval`;

      return {
        id: String(loan.accountNo || loan.id || ''),
        client: loan.clientName || loan.client?.displayName || 'Unknown Client',
        product: loan.loanProductName || loan.productName || 'Loan Product',
        amount: principalAmount,
        status: statusName,
        route: loanRoute
      };
    });
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

  private buildQuickActions(): DashboardQuickAction[] {
    const candidateActions: Array<DashboardQuickAction & { permissions?: string | string[] }> = [
      {
        label: 'Register Client',
        route: '/clients/create',
        permissions: [
          'CREATE_CLIENT',
          'ALL_FUNCTIONS'
        ]
      },
      {
        label: 'Find Client or Account',
        route: '/search',
        permissions: [
          'READ_CLIENT',
          'READ_LOAN',
          'READ_SAVINGSACCOUNT',
          'ALL_FUNCTIONS_READ',
          'ALL_FUNCTIONS'
        ]
      },
      {
        label: 'Group Collection',
        route: '/collections/collection-sheet',
        permissions: [
          'READ_COLLECTIONSHEET',
          'SAVE_COLLECTIONSHEET',
          'ALL_FUNCTIONS'
        ]
      },
      {
        label: 'Individual Collection',
        route: '/collections/individual-collection-sheet',
        permissions: [
          'READ_COLLECTIONSHEET',
          'SAVE_INDIVIDUALCOLLECTIONSHEET',
          'ALL_FUNCTIONS'
        ]
      },
      {
        label: 'Loan Approval',
        route: '/checker-inbox-and-tasks/loan-approval',
        permissions: [
          'APPROVE_LOAN',
          'APPROVE_LOAN_CHECKER',
          'ALL_FUNCTIONS'
        ]
      },
      {
        label: 'Loan Disbursal',
        route: '/checker-inbox-and-tasks/loan-disbursal',
        permissions: [
          'DISBURSE_LOAN',
          'APPROVE_LOAN',
          'ALL_FUNCTIONS'
        ]
      },
      {
        label: 'Checker Inbox',
        route: '/checker-inbox-and-tasks/checker-inbox',
        permissions: [
          'READ_MAKERCHECKER',
          'CHECKER_SUPER_USER',
          'ALL_FUNCTIONS'
        ]
      },
      {
        label: 'Reports',
        route: '/reports',
        permissions: [
          'READ_REPORT',
          'ALL_FUNCTIONS'
        ]
      }
    ];

    return candidateActions
      .filter((action) => this.hasPermission(action.permissions))
      .map(({ label, route }) => ({ label, route }));
  }

  private hasPermission(requiredPermissions?: string | string[]): boolean {
    if (!environment.productionModeEnableRBAC) {
      return true;
    }
    if (!requiredPermissions) {
      return true;
    }
    const credentials = this.authenticationService?.getCredentials();
    const userPermissions = credentials?.permissions ?? [];

    if (userPermissions.includes('ALL_FUNCTIONS')) {
      return true;
    }

    const perms = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    return perms.some((p) => {
      const trimmed = p.trim();
      if (!trimmed) {
        return false;
      }
      if (trimmed.startsWith('READ_') && userPermissions.includes('ALL_FUNCTIONS_READ')) {
        return true;
      }
      return userPermissions.includes(trimmed);
    });
  }

  private buildNonFinancialDashboard(): DashboardViewModel {
    return {
      kpis: [],
      alerts: [],
      tasks: [],
      recentLoans: [],
      activities: [],
      parSummary: [],
      quickActions: this.buildQuickActions(),
      portfolioTrend: [],
      productMix: []
    };
  }
}
