/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NavigationEnd, Router, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { AuthenticationService } from '../../authentication/authentication.service';
import { ConfigurationWizardService } from '../../../configuration-wizard/configuration-wizard.service';
import { DocumentationLinksService } from 'app/shared/services/documentation-links.service';
import { IconsModule } from 'app/shared/icons.module';
import { PopoverService } from '../../../configuration-wizard/popover/popover.service';
import { SettingsService } from 'app/settings/settings.service';
import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let router: Router;

  beforeEach(async () => {
    const mockAuthService = {
      getCredentials: jest.fn(() => ({ username: 'mifos' })),
      logout: jest.fn(() => of(void 0))
    };

    const mockSettingsService = {
      tenantIdentifier: 'microops-tenant'
    };

    const mockConfigWizardService = {
      showSideNav: false,
      showSideNavChartofAccounts: false
    };

    const mockPopoverService = {
      open: jest.fn()
    };

    const mockDocLinksService = {
      open: jest.fn()
    };

    const mockDialog = {
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        SidenavComponent,
        IconsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: ConfigurationWizardService, useValue: mockConfigWizardService },
        { provide: PopoverService, useValue: mockPopoverService },
        { provide: DocumentationLinksService, useValue: mockDocLinksService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create SidenavComponent', () => {
    expect(component).toBeTruthy();
    expect(component.username).toBe('mifos');
    expect(component.tenantIdentifier).toBe('microops-tenant');
  });

  it('should toggle group expansion state', () => {
    expect(component.isGroupExpanded('customers')).toBe(false);

    component.toggleGroup('customers');
    expect(component.isGroupExpanded('customers')).toBe(true);

    component.toggleGroup('customers');
    expect(component.isGroupExpanded('customers')).toBe(false);
  });

  it('should identify active navigation group based on current URL', () => {
    Object.defineProperty(router, 'url', { value: '/clients/view/1', configurable: true });
    expect(component.isGroupActive('customers')).toBe(true);
    expect(component.isGroupActive('accounting')).toBe(false);

    Object.defineProperty(router, 'url', { value: '/accounting/chart-of-accounts', configurable: true });
    expect(component.isGroupActive('accounting')).toBe(true);
    expect(component.isGroupActive('customers')).toBe(false);

    Object.defineProperty(router, 'url', { value: '/checker-inbox-and-tasks/loan-approval', configurable: true });
    expect(component.isGroupActive('loans')).toBe(true);

    Object.defineProperty(router, 'url', { value: '/collections/collection-sheet', configurable: true });
    expect(component.isGroupActive('collections')).toBe(true);

    Object.defineProperty(router, 'url', { value: '/products/saving-products', configurable: true });
    expect(component.isGroupActive('savings')).toBe(true);

    Object.defineProperty(router, 'url', { value: '/appusers', configurable: true });
    expect(component.isGroupActive('admin')).toBe(true);
  });

  it('should auto-expand active group on NavigationEnd event', () => {
    (router.events as any).next(new NavigationEnd(1, '/accounting', '/accounting'));
    expect(component.isGroupExpanded('accounting')).toBe(true);

    (router.events as any).next(new NavigationEnd(2, '/clients', '/clients'));
    expect(component.isGroupExpanded('customers')).toBe(true);
  });

  it('should navigate to defaultRoute on group click when sidenav is collapsed', () => {
    component.sidenavCollapsed = true;
    component.onGroupClick('customers', '/clients');

    expect(router.navigate).toHaveBeenCalledWith(['/clients']);
  });

  it('should toggle group expansion on group click when sidenav is expanded', () => {
    component.sidenavCollapsed = false;
    expect(component.isGroupExpanded('customers')).toBe(false);

    component.onGroupClick('customers', '/clients');
    expect(component.isGroupExpanded('customers')).toBe(true);
  });
});
