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
import { NavigationEnd, Router, RouterLink, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
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
import { environment } from '../../../../environments/environment';

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

  describe('Single-active parent disambiguation (WEB-365)', () => {
    it('should activate loans ONLY and NOT admin on loan product routes', () => {
      Object.defineProperty(router, 'url', { value: '/products/loan-products', configurable: true });
      expect(component.isGroupActive('loans')).toBe(true);
      expect(component.isGroupActive('admin')).toBe(false);
      expect(component.isGroupActive('savings')).toBe(false);
      expect(component.isGroupActive('customers')).toBe(false);
    });

    it('should activate savings ONLY and NOT admin on saving and deposit product routes', () => {
      const savingRoutes = [
        '/products/saving-products',
        '/products/saving-products/1',
        '/products/fixed-deposit',
        '/products/fixed-deposit/create',
        '/products/recurring-deposit',
        '/products/recurring-deposit/edit/2'
      ];

      for (const route of savingRoutes) {
        Object.defineProperty(router, 'url', { value: route, configurable: true });
        expect(component.isGroupActive('savings')).toBe(true);
        expect(component.isGroupActive('admin')).toBe(false);
        expect(component.isGroupActive('loans')).toBe(false);
      }
    });

    it('should activate admin ONLY on general products and catalog routes', () => {
      const adminProductRoutes = [
        '/products',
        '/products/share-products',
        '/products/charges',
        '/products/manage-tax-configurations',
        '/products/floating-rates'
      ];

      for (const route of adminProductRoutes) {
        Object.defineProperty(router, 'url', { value: route, configurable: true });
        expect(component.isGroupActive('admin')).toBe(true);
        expect(component.isGroupActive('loans')).toBe(false);
        expect(component.isGroupActive('savings')).toBe(false);
      }
    });

    it('should auto-expand ONLY loans on loan product navigation', () => {
      (router.events as any).next(new NavigationEnd(10, '/products/loan-products', '/products/loan-products'));
      expect(component.isGroupExpanded('loans')).toBe(true);
      expect(component.isGroupExpanded('admin')).toBe(false);
    });

    it('should auto-expand ONLY savings on saving product navigation', () => {
      (router.events as any).next(new NavigationEnd(11, '/products/saving-products', '/products/saving-products'));
      expect(component.isGroupExpanded('savings')).toBe(true);
      expect(component.isGroupExpanded('admin')).toBe(false);
    });

    it('should auto-expand ONLY admin on generic product navigation', () => {
      (router.events as any).next(new NavigationEnd(12, '/products/share-products', '/products/share-products'));
      expect(component.isGroupExpanded('admin')).toBe(true);
      expect(component.isGroupExpanded('loans')).toBe(false);
      expect(component.isGroupExpanded('savings')).toBe(false);
    });
  });

  describe('Keyboard navigation and ARIA accessibility (WEB-365)', () => {
    it('should toggle group expansion on Enter key', () => {
      component.sidenavCollapsed = false;
      fixture.detectChanges();
      const groupLink = fixture.debugElement.query(By.css('mat-list-item[role="button"]'));
      expect(groupLink).toBeTruthy();

      expect(component.isGroupExpanded('customers')).toBe(false);
      groupLink.triggerEventHandler('keydown.enter', { preventDefault: jest.fn() });
      expect(component.isGroupExpanded('customers')).toBe(true);

      groupLink.triggerEventHandler('keydown.enter', { preventDefault: jest.fn() });
      expect(component.isGroupExpanded('customers')).toBe(false);
    });

    it('should toggle group expansion on Space key and prevent default scroll', () => {
      component.sidenavCollapsed = false;
      fixture.detectChanges();
      const groupLink = fixture.debugElement.query(By.css('mat-list-item[role="button"]'));
      expect(groupLink).toBeTruthy();

      const preventDefaultSpy = jest.fn();
      expect(component.isGroupExpanded('customers')).toBe(false);
      groupLink.triggerEventHandler('keydown.space', { preventDefault: preventDefaultSpy });
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.isGroupExpanded('customers')).toBe(true);
    });

    it('should bind proper ARIA attributes to group parents', () => {
      component.sidenavCollapsed = false;
      fixture.detectChanges();

      const parentLinks = fixture.debugElement.queryAll(By.css('mat-list-item[role="button"]'));
      expect(parentLinks.length).toBe(6);

      for (const link of parentLinks) {
        expect(link.attributes['role']).toBe('button');
        expect(link.attributes['tabindex']).toBe('0');
        expect(link.attributes['aria-expanded']).toBe('false');
        expect(link.attributes['aria-controls']).toMatch(/^nav-subitems-/);
      }

      // Expand one group and verify aria-expanded updates
      component.toggleGroup('customers');
      fixture.detectChanges();
      const customersLink = parentLinks[0];
      expect(customersLink.attributes['aria-expanded']).toBe('true');
    });
  });

  it('should auto-expand active group on NavigationEnd event', () => {
    (router.events as any).next(new NavigationEnd(1, '/accounting', '/accounting'));
    expect(component.isGroupExpanded('accounting')).toBe(true);

    (router.events as any).next(new NavigationEnd(2, '/clients', '/clients'));
    expect(component.isGroupExpanded('customers')).toBe(true);
  });

  it('should reveal a collapsed group without navigating to a fixed route', () => {
    component.sidenavCollapsed = true;
    const expandSpy = jest.spyOn(component.expand, 'emit');
    component.onGroupClick('customers');

    expect(router.navigate).not.toHaveBeenCalled();
    expect(expandSpy).toHaveBeenCalled();
    expect(component.isGroupExpanded('customers')).toBe(true);
  });

  it('should toggle group expansion on group click when sidenav is expanded', () => {
    component.sidenavCollapsed = false;
    expect(component.isGroupExpanded('customers')).toBe(false);

    component.onGroupClick('customers');
    expect(component.isGroupExpanded('customers')).toBe(true);
  });

  it('should expose only permitted children after expanding for a group-only reader', () => {
    const previousRBAC = environment.productionModeEnableRBAC;
    try {
      environment.productionModeEnableRBAC = true;
      const auth = TestBed.inject(AuthenticationService);
      jest
        .spyOn(auth, 'getCredentials')
        .mockReturnValue({ username: 'group-reader', permissions: ['READ_GROUP'] } as any);
      const restrictedFixture = TestBed.createComponent(SidenavComponent);
      restrictedFixture.componentInstance.sidenavCollapsed = true;
      restrictedFixture.detectChanges();
      restrictedFixture.componentInstance.expand.subscribe(() => {
        restrictedFixture.componentRef.setInput('sidenavCollapsed', false);
      });
      restrictedFixture.componentInstance.onGroupClick('customers');
      restrictedFixture.detectChanges();
      const links = restrictedFixture.debugElement
        .queryAll(By.directive(RouterLink))
        .map((element) => router.serializeUrl(element.injector.get(RouterLink).urlTree));
      expect(links).toContain('/groups');
      expect(links).not.toContain('/clients');
      expect(router.navigate).not.toHaveBeenCalled();
      restrictedFixture.destroy();
    } finally {
      environment.productionModeEnableRBAC = previousRBAC;
    }
  });
});
