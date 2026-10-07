/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { of, throwError } from 'rxjs';

import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { TasksService } from 'app/tasks/tasks.service';
import { environment } from 'environments/environment';

import { DashboardApiService } from './dashboard-api.service';
import { DashboardFacadeService } from './dashboard-facade.service';
import { DashboardReportConfigService } from './dashboard-report-config.service';

describe('DashboardFacadeService', () => {
  let service: DashboardFacadeService;
  const dashboardApi = {
    runReport: jest.fn(),
    getRecentLoans: jest.fn()
  };
  const dashboardReportConfig = {
    getTotalPortfolioReportConfig: jest.fn()
  };
  const tasksService = {
    getMakerCheckerData: jest.fn(),
    getPendingRescheduleLoans: jest.fn(),
    getAllLoansToBeApproved: jest.fn(),
    getAllLoansToBeDisbursed: jest.fn(),
    getGroupedClientsData: jest.fn(),
    getAllSavingsToBeApproved: jest.fn()
  };
  const authenticationService = {
    isAuthenticated: jest.fn(),
    getCredentials: jest.fn()
  };

  beforeEach(() => {
    dashboardApi.runReport.mockReset();
    dashboardApi.getRecentLoans.mockReset();
    dashboardReportConfig.getTotalPortfolioReportConfig.mockReset();
    tasksService.getMakerCheckerData.mockReset();
    tasksService.getPendingRescheduleLoans.mockReset();
    tasksService.getAllLoansToBeApproved.mockReset();
    tasksService.getAllLoansToBeDisbursed.mockReset();
    tasksService.getGroupedClientsData.mockReset();
    tasksService.getAllSavingsToBeApproved.mockReset();
    authenticationService.isAuthenticated.mockReset();
    authenticationService.getCredentials.mockReset();

    dashboardReportConfig.getTotalPortfolioReportConfig.mockReturnValue({
      reportName: null,
      params: {}
    });
    authenticationService.isAuthenticated.mockReturnValue(true);
    authenticationService.getCredentials.mockReturnValue({
      permissions: ['ALL_FUNCTIONS']
    });

    dashboardApi.getRecentLoans.mockReturnValue(of([]));
    tasksService.getMakerCheckerData.mockReturnValue(of([]));
    tasksService.getPendingRescheduleLoans.mockReturnValue(of([]));
    tasksService.getAllLoansToBeApproved.mockReturnValue(of({ totalFilteredRecords: 0, pageItems: [] }));
    tasksService.getAllLoansToBeDisbursed.mockReturnValue(of({ totalFilteredRecords: 0, pageItems: [] }));
    tasksService.getGroupedClientsData.mockReturnValue(of({ totalFilteredRecords: 0, pageItems: [] }));
    tasksService.getAllSavingsToBeApproved.mockReturnValue(of({ totalFilteredRecords: 0, pageItems: [] }));

    TestBed.configureTestingModule({
      providers: [
        { provide: DashboardApiService, useValue: dashboardApi },
        { provide: DashboardReportConfigService, useValue: dashboardReportConfig },
        { provide: TasksService, useValue: tasksService },
        { provide: AuthenticationService, useValue: authenticationService }
      ]
    });

    service = TestBed.inject(DashboardFacadeService);
  });

  it('should expose the dashboard api integration seam', () => {
    expect(service.hasApiIntegrationReady()).toBe(true);
  });

  it('should keep total portfolio report unconfigured by default', () => {
    expect(service.hasTotalPortfolioReportConfigured()).toBe(false);
  });

  it('should return unauthorized status when user is not authenticated', (done) => {
    authenticationService.isAuthenticated.mockReturnValue(false);

    service.getDashboardState().subscribe((state) => {
      expect(state.status).toBe('unauthorized');
      expect(state.data).toBeNull();
      expect(state.message).toContain('Authentication');
      done();
    });
  });

  it('should fail closed when no live dashboard report is configured', (done) => {
    service.getDashboardState().subscribe((state) => {
      expect(state.status).toBe('empty');
      expect(state.data).not.toBeNull();
      expect(state.data!.kpis).toHaveLength(0);
      expect(state.data!.quickActions.length).toBeGreaterThan(0);
      expect(dashboardApi.runReport).not.toHaveBeenCalled();
      done();
    });
  });

  it('should show only live report-backed financial data when the report succeeds', (done) => {
    dashboardReportConfig.getTotalPortfolioReportConfig.mockReturnValue({
      reportName: 'DashboardPortfolioSummary',
      params: { officeId: 1 }
    });
    dashboardApi.runReport.mockReturnValue(of({ data: [{ row: { totalPortfolio: 'MMK 100M' } }] }));

    service.getDashboardState().subscribe((state) => {
      expect(state.status).toBe('ready');
      expect(dashboardApi.runReport).toHaveBeenCalledWith('DashboardPortfolioSummary', { officeId: 1 });

      const dashboard = state.data!;
      expect(dashboard.kpis).toEqual([
        {
          title: 'Total Portfolio',
          value: 'MMK 100M',
          helper: 'Report: DashboardPortfolioSummary',
          trend: 'Loaded from report',
          direction: 'flat',
          route: '/reports'
        }
      ]);
      expect(dashboard.alerts).toHaveLength(0);
      expect(dashboard.tasks).toHaveLength(0);
      expect(dashboard.recentLoans).toHaveLength(0);
      expect(dashboard.activities).toHaveLength(0);
      expect(dashboard.parSummary).toHaveLength(0);
      expect(dashboard.portfolioTrend).toHaveLength(0);
      expect(dashboard.productMix).toHaveLength(0);
      expect(dashboard.quickActions.length).toBeGreaterThan(0);
      expect(JSON.stringify(dashboard)).not.toContain('MMK 2,458.75M');
      expect(JSON.stringify(dashboard)).not.toContain('18,542');
      expect(JSON.stringify(dashboard)).not.toContain('MMK 412.80M');
      done();
    });
  });

  it('should fail closed when the configured report returns no usable financial value', (done) => {
    dashboardReportConfig.getTotalPortfolioReportConfig.mockReturnValue({
      reportName: 'DashboardPortfolioSummary',
      params: {}
    });
    dashboardApi.runReport.mockReturnValue(of({ data: [] }));

    service.getDashboardState().subscribe((state) => {
      expect(state.status).toBe('empty');
      expect(state.data).not.toBeNull();
      expect(state.data!.kpis).toHaveLength(0);
      expect(state.data!.quickActions.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should return an error state without fallback values when the live report fails', (done) => {
    dashboardReportConfig.getTotalPortfolioReportConfig.mockReturnValue({
      reportName: 'DashboardPortfolioSummary',
      params: {}
    });
    dashboardApi.runReport.mockReturnValue(throwError(() => new Error('report unavailable')));

    service.getDashboardState().subscribe((state) => {
      expect(state.status).toBe('error');
      expect(state.data).not.toBeNull();
      expect(state.data!.kpis).toHaveLength(0);
      expect(state.data!.quickActions.length).toBeGreaterThan(0);
      expect(JSON.stringify(state.data)).not.toContain('MMK 2,458.75M');
      done();
    });
  });

  it('should populate operational tasks and alerts with actionable navigation routes from Fineract', (done) => {
    tasksService.getMakerCheckerData.mockReturnValue(of([{ id: 101, action: 'CREATE', entity: 'CLIENT' }]));
    tasksService.getPendingRescheduleLoans.mockReturnValue(of([{ id: 201, loanAccountNo: '0001' }]));
    tasksService.getAllLoansToBeApproved.mockReturnValue(of({ totalFilteredRecords: 6 }));
    tasksService.getAllLoansToBeDisbursed.mockReturnValue(of({ totalFilteredRecords: 3 }));
    tasksService.getGroupedClientsData.mockReturnValue(of({ totalFilteredRecords: 2 }));
    tasksService.getAllSavingsToBeApproved.mockReturnValue(of({ totalFilteredRecords: 1 }));
    dashboardApi.getRecentLoans.mockReturnValue(
      of([
        {
          id: 501,
          accountNo: 'LN-00501',
          clientName: 'Jane Doe',
          clientId: 42,
          loanProductName: 'Agri Loan',
          principal: 1000000,
          currency: { displaySymbol: 'MMK' },
          status: { value: 'Active' }
        }
      ])
    );

    service.getDashboardState().subscribe((state) => {
      expect(state.status).toBe('ready');
      const data = state.data!;

      // Tasks
      expect(data.tasks).toHaveLength(2);
      expect(data.tasks[0]).toEqual({
        title: 'Maker-Checker Queue',
        meta: '1 item awaiting checker review',
        priority: 'Action Required',
        route: '/checker-inbox-and-tasks/checker-inbox'
      });
      expect(data.tasks[1]).toEqual({
        title: 'Loan Reschedule Requests',
        meta: '1 loan pending decision',
        priority: 'Pending Decision',
        route: '/checker-inbox-and-tasks/reschedule-loan'
      });

      // Alerts
      expect(data.alerts).toHaveLength(4);
      expect(data.alerts[0]).toEqual({
        title: 'Loans Pending Approval',
        description: '6 loan applications awaiting approval',
        severity: 'critical',
        route: '/checker-inbox-and-tasks/loan-approval'
      });
      expect(data.alerts[1]).toEqual({
        title: 'Loans Awaiting Disbursal',
        description: '3 approved loans ready for disbursement',
        severity: 'medium',
        route: '/checker-inbox-and-tasks/loan-disbursal'
      });
      expect(data.alerts[2]).toEqual({
        title: 'Pending Client Approvals',
        description: '2 client applications pending activation',
        severity: 'medium',
        route: '/checker-inbox-and-tasks/client-approval'
      });
      expect(data.alerts[3]).toEqual({
        title: 'Savings Accounts Pending Approval',
        description: '1 savings account awaiting approval',
        severity: 'info',
        route: '/checker-inbox-and-tasks'
      });

      // Recent Loans
      expect(data.recentLoans).toHaveLength(1);
      expect(data.recentLoans[0]).toEqual({
        id: 'LN-00501',
        client: 'Jane Doe',
        product: 'Agri Loan',
        amount: 'MMK 1,000,000',
        status: 'Active',
        route: '/clients/42/loans-accounts/501/general'
      });

      // Activities
      expect(data.activities).toEqual([
        { label: 'Loans Pending Approval', value: '6' },
        { label: 'Loans Ready for Disbursal', value: '3' },
        { label: 'Pending Client Activations', value: '2' },
        { label: 'Maker-Checker Queue Items', value: '1' }
      ]);

      done();
    });
  });

  it('should gracefully handle individual endpoint errors without failing the whole workspace', (done) => {
    tasksService.getMakerCheckerData.mockReturnValue(throwError(() => new Error('500 internal error')));
    tasksService.getAllLoansToBeApproved.mockReturnValue(of({ totalFilteredRecords: 2 }));
    dashboardApi.getRecentLoans.mockReturnValue(throwError(() => new Error('Network error')));

    service.getDashboardState().subscribe((state) => {
      expect(state.status).toBe('ready');
      const data = state.data!;
      expect(data.tasks).toHaveLength(0);
      expect(data.alerts).toHaveLength(1);
      expect(data.alerts[0].title).toBe('Loans Pending Approval');
      expect(data.recentLoans).toHaveLength(0);
      done();
    });
  });

  it('should filter quick actions by user permissions when RBAC is enabled', (done) => {
    const originalRbac = environment.productionModeEnableRBAC;
    (environment as any).productionModeEnableRBAC = true;

    authenticationService.getCredentials.mockReturnValue({
      permissions: [
        'READ_REPORT',
        'CREATE_CLIENT'
      ]
    });

    service.getDashboardState().subscribe((state) => {
      (environment as any).productionModeEnableRBAC = originalRbac;
      const actions = state.data!.quickActions;
      const actionLabels = actions.map((a) => a.label);

      expect(actionLabels).toContain('Register Client');
      expect(actionLabels).toContain('Reports');
      expect(actionLabels).not.toContain('Loan Approval');
      expect(actionLabels).not.toContain('Group Collection');
      done();
    });
  });
});
