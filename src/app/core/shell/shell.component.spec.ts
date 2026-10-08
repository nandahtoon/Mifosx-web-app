/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ProgressBarService } from '../progress-bar/progress-bar.service';
import { ShellComponent } from './shell.component';

@Component({
  selector: 'mifosx-sidenav',
  template: '',
  standalone: true
})
class MockSidenavComponent {
  @Input() sidenavCollapsed = false;
}

@Component({
  selector: 'mifosx-toolbar',
  template: '',
  standalone: true
})
class MockToolbarComponent {
  @Input() sidenav: any;
  @Input() sidenavCollapsed = false;
}

@Component({
  selector: 'mifosx-breadcrumb',
  template: '',
  standalone: true
})
class MockBreadcrumbComponent {}

@Component({
  selector: 'mifosx-content',
  template: '',
  standalone: true
})
class MockContentComponent {}

@Component({
  selector: 'mifosx-footer',
  template: '',
  standalone: true
})
class MockFooterComponent {
  @Input() styleClass = '';
}

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;
  let breakpointSubject: Subject<BreakpointState>;
  let progressBarSubject: Subject<string>;

  beforeEach(async () => {
    breakpointSubject = new Subject<BreakpointState>();
    progressBarSubject = new Subject<string>();

    const mockBreakpointObserver = {
      observe: jest.fn((queries: string | readonly string[]) => {
        if (queries === Breakpoints.Handset) {
          return of({ matches: false, breakpoints: {} });
        }
        return breakpointSubject.asObservable();
      })
    };

    const mockProgressBarService = {
      updateProgressBar: progressBarSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: ProgressBarService, useValue: mockProgressBarService }
      ]
    })
      .overrideComponent(ShellComponent, {
        set: {
          imports: [
            MatSidenavContainer,
            MatSidenav,
            MatSidenavContent,
            NgClass,
            AsyncPipe,
            MockSidenavComponent,
            MockToolbarComponent,
            MockBreadcrumbComponent,
            MockContentComponent,
            MockFooterComponent
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ShellComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should expand sidenav on desktop breakpoint (>= 1280px)', () => {
    breakpointSubject.next({
      matches: true,
      breakpoints: {
        '(min-width: 1280px)': true,
        '(min-width: 768px) and (max-width: 1279.98px)': false
      }
    });

    expect(component.sidenavCollapsed).toBe(false);
  });

  it('should collapse sidenav into compact mode on tablet breakpoint', () => {
    breakpointSubject.next({
      matches: true,
      breakpoints: {
        '(min-width: 1280px)': false,
        '(min-width: 768px) and (max-width: 1279.98px)': true
      }
    });

    expect(component.sidenavCollapsed).toBe(true);
  });

  it('should update progressBarMode when progress bar updates', () => {
    progressBarSubject.next('indeterminate');
    expect(component.progressBarMode).toBe('indeterminate');
  });

  it('should toggle collapse state explicitly', () => {
    component.toggleCollapse(false);
    expect(component.sidenavCollapsed).toBe(false);

    component.toggleCollapse(true);
    expect(component.sidenavCollapsed).toBe(true);
  });
});
