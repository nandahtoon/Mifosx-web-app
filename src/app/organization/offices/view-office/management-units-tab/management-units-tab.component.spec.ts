/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { ManagementUnitsTabComponent, CANONICAL_M01_UNITS } from './management-units-tab.component';

describe('ManagementUnitsTabComponent (Issue #124 Management Units Operator Navigation)', () => {
  let component: ManagementUnitsTabComponent;
  let fixture: ComponentFixture<ManagementUnitsTabComponent>;
  let routeData$: BehaviorSubject<{ office: any }>;
  let queryParams$: BehaviorSubject<any>;

  const headOfficeData: any = {
    id: 1,
    name: 'Head Office',
    externalId: 'btk-ho-ygn',
    parentId: null
  };

  const thanlyinBranch01Data: any = {
    id: 3,
    name: 'Thanlyin Branch 01',
    externalId: 'btk-br-ygn-thl-01',
    parentId: 2
  };

  const twantayBranch01Data: any = {
    id: 6,
    name: 'Twantay Branch 01',
    externalId: 'btk-br-ygn-twt-01',
    parentId: 2
  };

  beforeEach(async () => {
    routeData$ = new BehaviorSubject<{ office: any }>({ office: thanlyinBranch01Data });
    queryParams$ = new BehaviorSubject<any>({ demo: 'true' });

    await TestBed.configureTestingModule({
      imports: [
        ManagementUnitsTabComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: routeData$.asObservable(),
            queryParams: queryParams$.asObservable(),
            snapshot: {
              get queryParamMap() {
                return convertToParamMap(queryParams$.value);
              }
            }
          }
        },
        provideAnimationsAsync()
      ]
    }).compileComponents();

    TestBed.inject(FaIconLibrary).addIconPacks(solidIcons.fas);

    const translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('en', {
      labels: {
        officeView: {
          managementUnits: 'Management Units',
          notConfigured: 'NOT CONFIGURED',
          noUnitsConfigured: 'No Management Units Configured',
          noUnitsConfiguredDesc:
            'Management Units and operational rosters have not been configured for this office in the live environment.',
          enableDemoPreview: 'Enable Demo Mode Preview',
          syntheticBannerBadge: '[DEMO PREVIEW]',
          syntheticBannerText: 'Sample management units, assignments and capacity metrics',
          advisoryOnlyEnforcementDisabled: 'ADVISORY ONLY',
          scopeNoticeTitle: 'Office Hierarchy Scope Notice',
          headOffice: 'Head Office',
          subordinateOffice: 'Subordinate Office',
          corporateLevel: 'HEAD OFFICE',
          corporateNoticeDesc:
            'is an administrative coordination tier and does not directly host field management units. Management units are assigned directly to operating branch offices.',
          corporateNoticeThisOffice: 'This office',
          corporateNoticeFallbackName: 'Head Office',
          navigateBranches: 'Navigate to Operating Branch Offices:',
          inspectCompleteRoster: 'View All Management Units',
          completeOrgUnits: 'All Management Units (Demo Preview)',
          branchManagementUnits: 'Branch Management Units',
          returnToOfficeScope: 'Return to Office Scope',
          tableColUnitNameKey: 'Unit Name & Key',
          tableColBranch: 'Branch',
          tableColStatus: 'Status',
          tableColStaffing: 'Staffing (LOs)',
          tableColUnitManager: 'Unit Manager',
          tableColAdvisorySeverity: 'Advisory Severity',
          tableColActions: 'Actions',
          inspectDetail: 'Inspect Detail',
          backToUnitList: 'Back to Unit List',
          unitIdentityGovernance: 'Management Unit Details & Staff Assignments',
          policyPrefix: 'Policy:',
          branchOffice: 'Branch Office',
          controlledByGovernance: '',
          loanOfficerStaffing: 'Loan Officer Staffing',
          staffedTargetRatio: 'Staffed /',
          staffedTargetSuffix: 'Target',
          effectiveBaselineDate: 'Effective Baseline Date',
          unitManagerRosterBinding: 'Unit Manager Roster Binding',
          permanentPosting: 'PERMANENT POSTING',
          designationName: 'Designation / Name',
          staffExternalId: 'Staff External ID',
          positionKey: 'Position Key',
          postingReason: 'Posting Reason',
          loanOfficersRoster: 'Loan Officers Roster',
          positionsSuffix: 'Positions',
          staffed100: '100% STAFFED',
          role: 'Role',
          assignmentType: 'Assignment Type',
          effectiveDate: 'Effective Date',
          advisoryCapacitySignals: 'Advisory Capacity Signals & Workload Review',
          activeClientsBenchmark: 'Active Clients (Benchmark)',
          activeGroups: 'Active Groups',
          activeCenters: 'Active Centers',
          portfolioReviewSignal: 'Portfolio Review Signal',
          capacityPolicyFootnote:
            'Capacity metrics are advisory signals. Automated rebalancing or branch splitting is not enabled.',
          headOfficeNoticeTitle: 'Head Office Scope',
          noBranchDemoUnits: 'No Demo Units For This Branch',
          noBranchDemoUnitsDesc: 'Sample management units are not mapped for this branch in demo mode.'
        }
      }
    });
    translateService.use('en');

    fixture = TestBed.createComponent(ManagementUnitsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should display honest NOT CONFIGURED empty state when demo mode is inactive in live mode', () => {
    queryParams$.next({});
    fixture.detectChanges();

    expect(component.isDemoMode).toBe(false);
    expect(component.branchUnits.length).toBe(0);
    expect(component.allUnits.length).toBe(0);
    expect(component.selectedUnit()).toBeNull();

    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent || '';
    expect(textContent).toContain('NOT CONFIGURED');
    expect(textContent).toContain('No Management Units Configured');
    expect(textContent).toContain('Enable Demo Mode Preview');
  });

  it('should resolve Thanlyin Branch 01 unit and display unit detail in demo mode', () => {
    queryParams$.next({ demo: 'true' });
    fixture.detectChanges();

    expect(component.isDemoMode).toBe(true);
    expect(component.isBranchOffice).toBe(true);
    expect(component.isHeadOffice).toBe(false);
    expect(component.branchUnits.length).toBe(1);
    expect(component.branchUnits[0].unitKey).toBe('btk-unit-ygn-thl-01-01');

    const selected = component.selectedUnit();
    expect(selected).not.toBeNull();
    expect(selected?.name).toBe('Thanlyin Branch 01 Unit 01');

    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent || '';
    expect(textContent).toContain('Thanlyin Branch 01 Unit 01');
    expect(textContent).toContain('btk-unit-ygn-thl-01-01');
    expect(textContent).toContain('Unit Manager Thanlyin 01');
    expect(textContent).toContain('BTK-STG-STAFF-YGN-THL-01-MGR');
    expect(textContent).toContain('ADVISORY ONLY');
  });

  it('should display complete Loan Officers roster for the resolved unit in demo mode', () => {
    queryParams$.next({ demo: 'true' });
    fixture.detectChanges();

    const selected = component.selectedUnit();
    expect(selected?.loanOfficers.length).toBe(4);
    expect(selected?.loanOfficers[0].name).toBe('Loan Officer THL 01-01');
    expect(selected?.loanOfficers[3].staffExternalId).toBe('BTK-STG-STAFF-YGN-THL-01-LO-04');

    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent || '';
    expect(textContent).toContain('Loan Officers Roster (4 Positions)');
    expect(textContent).toContain('BTK-STG-STAFF-YGN-THL-01-LO-01');
    expect(textContent).toContain('BTK-STG-STAFF-YGN-THL-01-LO-04');
  });

  it('should display advisory capacity signals without active rebalancing', () => {
    queryParams$.next({ demo: 'true' });
    fixture.detectChanges();

    const selected = component.selectedUnit();
    expect(selected?.capacityMetrics.activeClients).toBe(120);
    expect(selected?.capacityMetrics.portfolioSignal).toBe('HEALTHY');

    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent || '';
    expect(textContent).toContain('120');
    expect(textContent).toContain('Active Clients (Benchmark)');
    expect(textContent).toContain('HEALTHY');
    expect(textContent).toContain('Capacity metrics are advisory signals');
  });

  it('should resolve Twantay Branch 01 unit properly when route changes in demo mode', () => {
    queryParams$.next({ demo: 'true' });
    routeData$.next({ office: twantayBranch01Data });
    fixture.detectChanges();

    expect(component.isBranchOffice).toBe(true);
    expect(component.branchUnits.length).toBe(1);
    expect(component.branchUnits[0].unitKey).toBe('btk-unit-ygn-twt-01-01');

    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent || '';
    expect(textContent).toContain('Twantay Branch 01 Unit 01');
    expect(textContent).toContain('Unit Manager Twantay 01');
    expect(textContent).toContain('BTK-STG-STAFF-YGN-TWT-01-MGR');
  });

  it('should render corporate scope notice and demo management units table when viewing Head Office in demo mode', () => {
    queryParams$.next({ demo: 'true' });
    routeData$.next({ office: headOfficeData });
    fixture.detectChanges();

    expect(component.isHeadOffice).toBe(true);
    expect(component.isBranchOffice).toBe(false);
    expect(component.branchUnits.length).toBe(0);

    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent || '';
    expect(textContent).toContain('Office Hierarchy Scope Notice');
    expect(textContent).toContain('Head Office');
    expect(textContent).toContain('All Management Units (Demo Preview)');
    expect(textContent).toContain('btk-unit-ygn-thl-01-01');
  });

  it('should allow inspecting unit detail and navigating back to unit list from Head Office view in demo mode', () => {
    queryParams$.next({ demo: 'true' });
    routeData$.next({ office: headOfficeData });
    fixture.detectChanges();

    const targetUnit = CANONICAL_M01_UNITS[4]; // Twantay Branch 02 Unit 01
    component.selectUnit(targetUnit);
    fixture.detectChanges();

    expect(component.selectedUnit()?.unitKey).toBe('btk-unit-ygn-twt-02-01');

    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent || '';
    expect(textContent).toContain('Twantay Branch 02 Unit 01');
    expect(textContent).toContain('Unit Manager Twantay 02');

    component.clearSelectedUnit();
    fixture.detectChanges();
    expect(component.selectedUnit()).toBeNull();
  });

  it('should handle unknown branch in demo mode without misidentifying it as corporate', () => {
    const unknownBranchData = {
      id: 99,
      name: 'Mandalay Central Branch',
      externalId: 'btk-br-mdy-01',
      parentId: 1
    };
    queryParams$.next({ demo: 'true' });
    routeData$.next({ office: unknownBranchData });
    fixture.detectChanges();

    expect(component.isBranchOffice).toBe(true);
    expect(component.isHeadOffice).toBe(false);
    expect(component.branchUnits.length).toBe(0);

    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent || '';
    expect(textContent).toContain('No Demo Units For This Branch');
    expect(textContent).not.toContain('Office Hierarchy Scope Notice');

    component.toggleShowAllUnits();
    fixture.detectChanges();
    expect(component.showAllUnits()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('All Management Units (Demo Preview)');
  });
});
