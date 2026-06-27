/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

import { DashboardApiService } from './dashboard-api.service';

describe('DashboardApiService', () => {
  let service: DashboardApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(DashboardApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should call a dashboard run report with params', (done) => {
    service.runReport('DashboardPortfolioSummary', { officeId: 1, currencyCode: 'MMK' }).subscribe((response) => {
      expect(response.data).toEqual([]);
      done();
    });

    const request = httpTestingController.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === '/runreports/DashboardPortfolioSummary' &&
        req.params.get('officeId') === '1' &&
        req.params.get('currencyCode') === 'MMK'
    );

    request.flush({ data: [] });
  });
});
