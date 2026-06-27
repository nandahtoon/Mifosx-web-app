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

  it('should return a complete dashboard view model', (done) => {
    service.getDashboardViewModel().subscribe((dashboard) => {
      expect(dashboard.kpis.length).toBeGreaterThan(0);
      expect(dashboard.alerts.length).toBeGreaterThan(0);
      expect(dashboard.tasks.length).toBeGreaterThan(0);
      expect(dashboard.recentLoans.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should provide route targets for KPI cards', (done) => {
    service.getDashboardViewModel().subscribe((dashboard) => {
      expect(dashboard.kpis.every((kpi) => kpi.route.startsWith('/'))).toBe(true);
      done();
    });
  });

  it('should include an operational PAR KPI', (done) => {
    service.getDashboardViewModel().subscribe((dashboard) => {
      expect(dashboard.kpis.some((kpi) => kpi.title.includes('PAR'))).toBe(true);
      done();
    });
  });
});
