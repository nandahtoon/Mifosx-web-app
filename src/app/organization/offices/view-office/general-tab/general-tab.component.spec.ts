/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { GeneralTabComponent } from './general-tab.component';

import { SettingsService } from 'app/settings/settings.service';

describe('GeneralTabComponent (Issue #123 Office Geography & Identity)', () => {
  let component: GeneralTabComponent;
  let fixture: ComponentFixture<GeneralTabComponent>;
  let routeData$: BehaviorSubject<{ office: any }>;

  const mockSettingsService = {
    language: { code: 'en' },
    dateFormat: 'dd MMMM yyyy'
  };

  const minimalOfficeData = {
    id: 3,
    name: 'Thanlyin Branch 01',
    nameDecorated: 'Thanlyin Branch 01',
    externalId: 'btk-br-ygn-thl-01',
    openingDate: [
      2016,
      1,
      1
    ],
    hierarchy: '.1.2.3.',
    parentId: 2,
    parentName: 'Yangon Regional Office'
  };

  const fullyConfiguredOfficeData = {
    ...minimalOfficeData,
    country: 'Myanmar',
    stateProvince: 'Yangon Region',
    township: 'Thanlyin Township',
    pcode: 'MMR013007',
    addressLine1: 'No. 45, Bogyoke Road',
    addressLine2: 'Ward 3',
    city: 'Thanlyin',
    postalCode: '11291',
    latitude: 16.7324,
    longitude: 96.2518,
    geolocationPrecision: 'ROOFTOP_SURVEYED',
    homeTownship: 'Thanlyin',
    bookingEnabled: true,
    capacityPolicyRef: 'default-management-unit'
  };

  beforeEach(async () => {
    routeData$ = new BehaviorSubject<{ office: any }>({ office: minimalOfficeData });

    await TestBed.configureTestingModule({
      imports: [
        GeneralTabComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: routeData$.asObservable()
          }
        },
        { provide: SettingsService, useValue: mockSettingsService },
        DatePipe,
        provideAnimationsAsync()
      ]
    }).compileComponents();

    TestBed.inject(FaIconLibrary).addIconPacks(solidIcons.fas);

    const translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', {
      labels: {
        heading: { General: 'General' },
        inputs: {
          'Parent Office': 'Parent Office',
          'Opened On': 'Opened On',
          'Name Decorated': 'Name Decorated',
          'External Id': 'External Id',
          Unassigned: 'Unassigned'
        },
        officeView: {
          generalAndHierarchy: 'General & Hierarchy',
          headOffice: 'Head Office',
          subordinateOffice: 'Subordinate Office',
          noneRoot: 'None (Root)',
          unassigned: 'Unassigned',
          hierarchyPath: 'Hierarchy Path',
          administrativeGeography: 'Administrative Geography',
          configured: 'CONFIGURED',
          notConfigured: 'NOT CONFIGURED',
          country: 'Country',
          stateRegion: 'State / Region / UT',
          districtTownship: 'District / Township',
          mimuPcode: 'MIMU PCode Reference',
          notConfiguredPendingDataset: 'NOT CONFIGURED',
          mimuGovernanceFootnote:
            'Administrative boundaries and locality references are maintained in the organization master data.',
          physicalAndContactAddress: 'Physical & Contact Address',
          unavailable: 'UNAVAILABLE',
          addressLine1: 'Street Address Line 1',
          addressLine2: 'Street Address Line 2',
          city: 'Town / City',
          postalCode: 'Postal Code',
          mapCoordinatesAndGeolocation: 'Map Coordinates & Geolocation',
          latitude: 'Latitude',
          longitude: 'Longitude',
          geolocationPrecision: 'Geolocation Precision',
          unavailableNotConfigured: 'UNAVAILABLE / NOT CONFIGURED',
          coordinatesFootnote:
            'Field coordinates require authoritative survey verification; synthetic coordinates are prohibited.',
          serviceAreaAndPolicy: 'Service Area & Operating Policy',
          draftUnavailable: 'DRAFT / UNAVAILABLE',
          homeTownship: 'Home Township',
          catchmentLocalities: 'Catchment Localities',
          catchmentDraft: '0 (DRAFT — No locality assignments approved)',
          bookingPolicy: 'Booking Policy',
          enabled: 'ENABLED',
          disabled: 'DISABLED',
          capacityPolicyRef: 'Capacity Policy Ref'
        }
      }
    });
    translateService.use('en');

    fixture = TestBed.createComponent(GeneralTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should identify subordinate office type correctly', () => {
    expect(component.isHeadOffice).toBe(false);
    expect(component.officeType).toBe('SUBORDINATE_OFFICE');
  });

  it('should display NOT CONFIGURED badges when administrative geography is missing', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.country).toBeNull();
    expect(component.stateProvince).toBeNull();
    expect(component.township).toBeNull();
    expect(component.pcode).toBeNull();

    const textContent = compiled.textContent || '';
    expect(textContent).toContain('NOT CONFIGURED');
    expect(textContent).toContain('Administrative boundaries and locality references are maintained');
  });

  it('should display UNAVAILABLE badges when physical address is unconfigured', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.addressLine1).toBeNull();
    expect(component.city).toBeNull();
    expect(component.postalCode).toBeNull();

    const textContent = compiled.textContent || '';
    expect(textContent).toContain('UNAVAILABLE');
  });

  it('should display NOT CONFIGURED when coordinates are null without inventing synthetic values', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.latitude).toBeNull();
    expect(component.longitude).toBeNull();

    const textContent = compiled.textContent || '';
    expect(textContent).toContain('Field coordinates require authoritative survey verification');
    expect(textContent).not.toContain('16.7324');
  });

  it('should render configured geographic and coordinate values when provided', () => {
    routeData$.next({ office: fullyConfiguredOfficeData });
    fixture.detectChanges();

    expect(component.country).toBe('Myanmar');
    expect(component.stateProvince).toBe('Yangon Region');
    expect(component.township).toBe('Thanlyin Township');
    expect(component.pcode).toBe('MMR013007');
    expect(component.addressLine1).toBe('No. 45, Bogyoke Road');
    expect(component.city).toBe('Thanlyin');
    expect(component.latitude).toBe(16.7324);
    expect(component.longitude).toBe(96.2518);
    expect(component.geolocationPrecision).toBe('ROOFTOP_SURVEYED');

    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent || '';
    expect(textContent).toContain('Myanmar');
    expect(textContent).toContain('Yangon Region');
    expect(textContent).toContain('MMR013007');
    expect(textContent).toContain('No. 45, Bogyoke Road');
    expect(textContent).toContain('16.7324');
    expect(textContent).toContain('96.2518');
    expect(textContent).toContain('CONFIGURED');
  });

  it('should identify head office correctly for root office', () => {
    const headOffice: any = {
      id: 1,
      name: 'Head Office',
      parentId: null
    };
    routeData$.next({ office: headOffice });
    fixture.detectChanges();

    expect(component.isHeadOffice).toBe(true);
    expect(component.officeType).toBe('HEAD_OFFICE');
  });
});
