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

import { DashboardApiService } from './dashboard-api.service';
import { DashboardFacadeService } from './dashboard-facade.service';
import { DashboardReportConfigService } from './dashboard-report-config.service';

describe('DashboardFacadeService', () => {
  let service: DashboardFacadeService;
  const dashboardApi = {
    runReport: jest.fn()
  };
  const dashboardReportConfig = {
    getTotalPortfolioReportConfig: jest.fn()
  };

  beforeEach(() => {
    dashboardApi.runReport.mockReset();
    dashboardReportConfig.getTotalPortfolioReportConfig.mockReset();
    dashboardReportConfig.getTotalPortfolioReportConfig.mockReturnValue({
      reportName: null,
      params: {}
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: DashboardApiService, useValue: dashboardApi },
        { provide: DashboardReportConfigService, useValue: dashboardReportConfig }
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
});
