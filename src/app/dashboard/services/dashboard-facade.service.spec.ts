/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from '@jest/globals';

import { DashboardFacadeService } from './dashboard-facade.service';

describe('DashboardFacadeService', () => {
  let service: DashboardFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardFacadeService);
  });

  it('should return a ready dashboard state with no error message', (done) => {
    service.getDashboardState().subscribe((state) => {
      expect(state.status).toBe('ready');
      expect(state.data).not.toBeNull();
      expect(state.message).toBeUndefined();
      done();
    });
  });

  it('should return a complete dashboard view model', (done) => {
    service.getDashboardState().subscribe((state) => {
      const dashboard = state.data;
      expect(dashboard).not.toBeNull();
      expect(dashboard!.kpis.length).toBeGreaterThan(0);
      expect(dashboard!.alerts.length).toBeGreaterThan(0);
      expect(dashboard!.tasks.length).toBeGreaterThan(0);
      expect(dashboard!.recentLoans.length).toBeGreaterThan(0);
      expect(dashboard!.activities.length).toBeGreaterThan(0);
      expect(dashboard!.parSummary.length).toBeGreaterThan(0);
      expect(dashboard!.quickActions.length).toBeGreaterThan(0);
      expect(dashboard!.portfolioTrend.length).toBeGreaterThan(0);
      expect(dashboard!.productMix.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should provide route targets for KPI cards and quick actions', (done) => {
    service.getDashboardState().subscribe((state) => {
      const dashboard = state.data!;
      expect(dashboard.kpis.every((kpi) => kpi.route.startsWith('/'))).toBe(true);
      expect(dashboard.quickActions.every((action) => action.route.startsWith('/'))).toBe(true);
      done();
    });
  });

  it('should include an operational PAR KPI and PAR summary', (done) => {
    service.getDashboardState().subscribe((state) => {
      const dashboard = state.data!;
      expect(dashboard.kpis.some((kpi) => kpi.title.includes('PAR'))).toBe(true);
      expect(dashboard.parSummary.some((row) => row.label.includes('PAR'))).toBe(true);
      done();
    });
  });

  it('should keep chart values within a safe display range', (done) => {
    service.getDashboardState().subscribe((state) => {
      const dashboard = state.data!;
      expect(dashboard.portfolioTrend.every((point) => point.value >= 0 && point.value <= 100)).toBe(true);
      expect(dashboard.productMix.every((item) => item.value >= 0 && item.value <= 100)).toBe(true);
      done();
    });
  });
});
