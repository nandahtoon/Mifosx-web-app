/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'app/core/authentication/authentication.service';
import { AnalyticsWidgetState } from '../models/analytics-dashboard.model';
import { AnalyticsDataSourceService } from '../services/analytics-data-source.service';
import { AnalyticsVisibilityService } from '../services/analytics-visibility.service';
import { DashboardEngineComponent } from './dashboard-engine.component';

@Component({
  standalone: true,
  imports: [DashboardEngineComponent],
  template: '<mifosx-analytics-dashboard [dashboard]="dashboard" />'
})
class DashboardHostComponent {
  dashboard = {
    id: 'test',
    titleKey: 'test',
    widgets: [
      { id: 'clients', titleKey: 'test', type: 'metric', layout: 'metric', adapter: 'client-total', icon: 'users' }
    ]
  } as DashboardEngineComponent['dashboard'];
}

describe('DashboardEngineComponent asynchronous rendering', () => {
  let response: Subject<AnalyticsWidgetState>;

  beforeEach(async () => {
    response = new Subject();
    await TestBed.configureTestingModule({
      imports: [DashboardHostComponent],
      providers: [
        UntypedFormBuilder,
        { provide: AuthenticationService, useValue: { getCredentials: () => ({ officeId: 1 }) } },
        { provide: AnalyticsVisibilityService, useValue: { canView: () => true } },
        { provide: AnalyticsDataSourceService, useValue: { loadWidget: () => response, clearCache: jest.fn() } }
      ]
    })
      .overrideComponent(DashboardEngineComponent, {
        set: {
          imports: [],
          template:
            '{{ widgetStateMap["clients"]?.loading }}|{{ widgetStateMap["clients"]?.empty }}|{{ widgetStateMap["clients"]?.metricValue }}'
        }
      })
      .compileComponents();
  });

  it.each([
    [
      { loading: false, empty: false, metricValue: 7 },
      'false|false|7'
    ],
    [
      { loading: false, empty: true },
      'false|true|'
    ]
  ])('renders a completed asynchronous report without another user action', (state, expected) => {
    const fixture = TestBed.createComponent(DashboardHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('true|false|');
    response.next(state as AnalyticsWidgetState);
    response.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe(expected);
  });

  it('leaves the loading placeholder when a report fails', () => {
    const fixture = TestBed.createComponent(DashboardHostComponent);
    fixture.detectChanges();
    response.error(new Error('Synthetic report failure'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('false|true|');
  });
});
