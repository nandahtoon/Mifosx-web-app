/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Models */
import { DashboardRunReportParams, DashboardRunReportResponse } from '../models/dashboard-api.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService {
  private readonly http = inject(HttpClient);

  runReport(reportName: string, params: DashboardRunReportParams = {}): Observable<DashboardRunReportResponse> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([
      key,
      value
    ]) => {
      httpParams = httpParams.set(key, String(value));
    });

    return this.http.get<DashboardRunReportResponse>(`/runreports/${reportName}`, { params: httpParams });
  }
}
