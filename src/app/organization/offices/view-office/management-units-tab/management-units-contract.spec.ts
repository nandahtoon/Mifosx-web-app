/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Consumer contract guard for Management Units (Program #124 / AG1 #144 / Infra #60).
 *
 * Producer references:
 *   - Canonical reconciled schema: AG1 PR #146 head `8edeb6d582cdef870d61a70285f87bd02a0e275c`
 *     (`profiles/schema/management-unit-web-contract.schema.json`, Version 1.1.0-reconciled).
 *   - Historical draft proposal (superseded): AG1 PR #140 head `ca7ee9d4993517fab0aeeb8b45fee9d4f160c5b0`.
 *
 * These tests do NOT certify end-to-end integration. The Unit REST API is not served
 * locally (APISIX :9080 returns 404 for /api/v1/units). They verify:
 *   1. canonical schema validation of Web fixtures against AG1 PR #146 reconciled contract;
 *   2. explicit classification of required vs deferred fields (isSimulated, overlays, thresholds, RFC7807);
 *   3. historical drift snapshot against superseded PR #140 proposal (labeled OLD / DEPRECATED);
 *   4. consumer safety: zero HTTP calls to /api/v1/units and visibly synthetic demo fixtures.
 */

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule } from '@ngx-translate/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { CANONICAL_M01_UNITS, ManagementUnitsTabComponent } from './management-units-tab.component';

const Ajv2020 = require('ajv/dist/2020');
const WEB_CONTRACT_SCHEMA = require('../../../../../../docs/contracts/management-unit-web-contract.schema.json');

/** AG1 draft contract §2.1 list item sample (verbatim keys from superseded PR #140). */
const AG1_LIST_ITEM_SAMPLE_SUPERSEDED = {
  unitKey: 'syn-unit-ygn-01-01',
  name: 'Synthetic Branch 01 Unit 01',
  branchKey: 'syn-br-ygn-01',
  branchName: 'Synthetic Branch 01',
  status: 'ACTIVE',
  manager: {
    positionKey: 'syn-unit-ygn-01-01-manager',
    staffExternalId: 'SYN-STG-STAFF-YGN-01-MGR',
    displayName: 'Simulated-MGR YGN-01',
    isSimulated: true
  },
  activeLoanOfficerCount: 4,
  targetLoanOfficerPositions: 4,
  capacitySeverity: 'NORMAL',
  hasTemporaryOverlay: true,
  validFrom: '2026-01-01',
  validTo: null as string | null
};

/** AG1 draft contract §2.2 unit detail sample (verbatim keys from superseded PR #140). */
const AG1_DETAIL_SAMPLE_SUPERSEDED = {
  unitKey: 'syn-unit-ygn-01-01',
  name: 'Synthetic Branch 01 Unit 01',
  branchKey: 'syn-br-ygn-01',
  branchName: 'Synthetic Branch 01',
  status: 'ACTIVE',
  capacityPolicyRef: 'default-management-unit',
  validFrom: '2026-01-01',
  validTo: null as string | null,
  manager: {
    positionKey: 'syn-unit-ygn-01-01-manager',
    staffExternalId: 'SYN-STG-STAFF-YGN-01-MGR',
    displayName: 'Simulated-MGR YGN-01',
    staffingStatus: 'FILLED',
    isSimulated: true
  },
  loanOfficers: [
    {
      positionKey: 'syn-unit-ygn-01-01-lo-01',
      staffExternalId: 'SYN-STG-STAFF-YGN-01-LO-01',
      displayName: 'Simulated-LO-01 YGN-01',
      staffingStatus: 'FILLED',
      assignmentType: 'PERMANENT',
      hasOverlay: true,
      isSimulated: true
    }
  ],
  vacancies: 0,
  capacity: {
    evaluationCadence: 'MONTHLY',
    asOfDate: '2026-09-10',
    overallSeverity: 'NORMAL',
    metrics: {
      activeClients: { value: 180, target: 200, warning: 225, hard: 250, severity: 'NORMAL' },
      groups: { value: 18, target: 20, warning: 23, hard: 25, severity: 'NORMAL' },
      centers: { value: 7, target: 8, warning: 10, hard: 12, severity: 'NORMAL' }
    },
    recommendation: 'NONE'
  },
  effectiveOverlays: [
    {
      assignmentKey: 'syn-temp-branch-support-01',
      staffExternalId: 'SYN-STG-STAFF-YGN-01-LO-01',
      assignmentType: 'TEMPORARY',
      targetBranchKey: 'syn-br-ygn-02',
      targetUnitKey: 'syn-unit-ygn-02-01',
      validFrom: '2026-10-10',
      validTo: '2026-10-24',
      reasonCode: 'LEAVE_COVERAGE'
    }
  ]
};

/** AG1 draft contract §4.3 capacity severity vocabulary (superseded PR #140). */
const AG1_SEVERITIES_SUPERSEDED = [
  'NORMAL',
  'TREND',
  'REVIEW',
  'HARD'
];

/** AG1 draft contract §3 supported RFC 7807 error codes (PR #140 / PR #146). */
const AG1_ERROR_CODES = [
  'UNIT_NOT_FOUND',
  'STAFF_BRANCH_MISMATCH',
  'NOT_A_LOAN_OFFICER',
  'DUPLICATE_PERMANENT_ASSIGNMENT',
  'OVERLAPPING_OVERLAY',
  'STAFF_INACTIVE',
  'UNIT_INACTIVE',
  'CHRONOLOGY_INVALID',
  'AMBIGUOUS_HOME_AUTHORITY',
  'UNAVAILABLE_IN_FINERACT'
];

function keyDrift(producer: object, consumer: object): { onlyInProducer: string[]; onlyInConsumer: string[] } {
  const p = Object.keys(producer);
  const c = Object.keys(consumer);
  return {
    onlyInProducer: p.filter((k) => !c.includes(k)).sort(),
    onlyInConsumer: c.filter((k) => !p.includes(k)).sort()
  };
}

describe('Management Units canonical consumer schema validation (AG1 PR #146 reconciled schema v1.1.0 @ 8edeb6d)', () => {
  let ajv: any;
  let validateFn: any;

  beforeEach(() => {
    ajv = new Ajv2020({ allErrors: true, strict: false });
    ajv.addFormat('date', /^\d{4}-\d{2}-\d{2}$/);
    validateFn = ajv.compile(WEB_CONTRACT_SCHEMA);
  });

  it('compiles canonical JSON schema without syntax or reference errors', () => {
    expect(typeof validateFn).toBe('function');
    expect(WEB_CONTRACT_SCHEMA.$id).toBe('https://microops-360.net/schemas/management-unit-web-contract.schema.json');
    expect(WEB_CONTRACT_SCHEMA.required).toContain('manager');
    expect(WEB_CONTRACT_SCHEMA.required).toContain('capacityMetrics');
  });

  it('validates 100% of CANONICAL_M01_UNITS fixtures against canonical contract schema', () => {
    expect(CANONICAL_M01_UNITS.length).toBe(5);

    for (const unit of CANONICAL_M01_UNITS) {
      const valid = validateFn(unit);
      if (!valid) {
        // Output specific error details if validation fails
        const errorMsg = JSON.stringify(validateFn.errors, null, 2);
        expect(errorMsg).toBe('');
      }
      expect(valid).toBe(true);
      expect(validateFn.errors).toBeNull();
    }
  });

  it('validates Thanlyin Branch 01 Unit 01 fixture structure and nested properties', () => {
    const unit = CANONICAL_M01_UNITS[0];
    const valid = validateFn(unit);
    expect(valid).toBe(true);

    expect(unit.unitKey).toBe('btk-unit-ygn-thl-01-01');
    expect(unit.branchKey).toBe('btk-br-ygn-thl-01');
    expect(unit.status).toBe('PLANNED');
    expect(unit.manager.name).toBe('Unit Manager Thanlyin 01');
    expect(unit.manager.assignmentType).toBe('PERMANENT');
    expect(unit.loanOfficers.length).toBe(4);
    expect(unit.capacityMetrics.advisoryStatus).toBe('NORMAL / TARGET');
    expect(unit.capacityMetrics.portfolioSignal).toBe('HEALTHY');
  });

  it('validates Twantay Branch 02 Unit 01 fixture structure and nested properties', () => {
    const unit = CANONICAL_M01_UNITS[4];
    const valid = validateFn(unit);
    expect(valid).toBe(true);

    expect(unit.unitKey).toBe('btk-unit-ygn-twt-02-01');
    expect(unit.branchKey).toBe('btk-br-ygn-twt-02');
    expect(unit.manager.name).toBe('Unit Manager Twantay 02');
    expect(unit.loanOfficers.length).toBe(4);
    expect(unit.capacityMetrics.activeClients).toBe(122);
  });
});

describe('Management Units contract field classification (v1 accepted required vs deferred)', () => {
  it('classifies isSimulated as DEFERRED / OPTIONAL metadata in v1 schema', () => {
    // isSimulated is defined as optional on manager and loanOfficers in the schema
    const managerProps = WEB_CONTRACT_SCHEMA.properties.manager.properties;
    const loProps = WEB_CONTRACT_SCHEMA.properties.loanOfficers.items.properties;

    expect(managerProps.isSimulated.type).toBe('boolean');
    expect(WEB_CONTRACT_SCHEMA.properties.manager.required).not.toContain('isSimulated');
    expect(loProps.isSimulated.type).toBe('boolean');
    expect(WEB_CONTRACT_SCHEMA.properties.loanOfficers.items.required).not.toContain('isSimulated');

    // Web fixture does not yet provide isSimulated; schema permits omission
    expect(CANONICAL_M01_UNITS[0].manager).not.toHaveProperty('isSimulated');
  });

  it('classifies hasTemporaryOverlay and effectiveOverlays as DEFERRED until runtime scope resolver is active', () => {
    // hasTemporaryOverlay is optional boolean in v1 schema
    expect(WEB_CONTRACT_SCHEMA.properties.hasTemporaryOverlay.type).toBe('boolean');
    expect(WEB_CONTRACT_SCHEMA.required).not.toContain('hasTemporaryOverlay');

    // effectiveOverlays is deferred from v1 web contract; client does not parse active overlays yet
    expect(WEB_CONTRACT_SCHEMA.properties).not.toHaveProperty('effectiveOverlays');
  });

  it('classifies detailed metric thresholds (warning/hard values) as DEFERRED from v1 web contract', () => {
    // Reconciled v1 schema requires summary capacityMetrics with signal enums, not full nested threshold trees
    const capacityMetricsReq = WEB_CONTRACT_SCHEMA.properties.capacityMetrics.required;
    expect(capacityMetricsReq).toEqual([
      'activeClients',
      'activeGroups',
      'activeCenters',
      'portfolioSignal',
      'advisoryStatus'
    ]);

    // Flat numerical metrics and signal enums are fully satisfied by Web DTO
    const metrics = CANONICAL_M01_UNITS[0].capacityMetrics;
    expect(typeof metrics.activeClients).toBe('number');
    expect([
      'HEALTHY',
      'WARNING',
      'BREACH'
    ]).toContain(metrics.portfolioSignal);
    expect([
      'NORMAL / TARGET',
      'WARNING',
      'HARD BREACH'
    ]).toContain(metrics.advisoryStatus);
  });

  it('classifies RFC 7807 problem details error handling as DEFERRED to live runtime phase', () => {
    // Web client currently issues zero HTTP calls for units, so error interceptors are deferred
    expect(AG1_ERROR_CODES.length).toBe(10);
    expect(AG1_ERROR_CODES).toContain('UNIT_NOT_FOUND');
    expect(AG1_ERROR_CODES).toContain('UNAVAILABLE_IN_FINERACT');
  });
});

describe('OLD / DEPRECATED: Historical drift snapshot against superseded PR #140 proposal (AG1 ca7ee9d)', () => {
  const webUnit = CANONICAL_M01_UNITS[0];

  it('pins top-level drift between Web demo DTO and superseded AG1 unit detail proposal', () => {
    expect(keyDrift(AG1_DETAIL_SAMPLE_SUPERSEDED, webUnit)).toEqual({
      onlyInProducer: [
        'capacity',
        'effectiveOverlays',
        'vacancies'
      ],
      onlyInConsumer: [
        'capacityMetrics',
        'staffedLoanOfficerPositions',
        'targetLoanOfficerPositions'
      ]
    });
  });

  it('pins top-level drift between Web demo DTO and superseded AG1 list item proposal', () => {
    expect(keyDrift(AG1_LIST_ITEM_SAMPLE_SUPERSEDED, webUnit)).toEqual({
      onlyInProducer: [
        'activeLoanOfficerCount',
        'capacitySeverity',
        'hasTemporaryOverlay'
      ],
      onlyInConsumer: [
        'capacityMetrics',
        'capacityPolicyRef',
        'loanOfficers',
        'staffedLoanOfficerPositions'
      ]
    });
  });

  it('pins manager drift in superseded proposal (displayName vs name)', () => {
    expect(keyDrift(AG1_DETAIL_SAMPLE_SUPERSEDED.manager, webUnit.manager)).toEqual({
      onlyInProducer: [
        'displayName',
        'isSimulated',
        'staffingStatus'
      ],
      onlyInConsumer: [
        'assignmentType',
        'name',
        'reason',
        'status',
        'validFrom'
      ]
    });
  });

  it('pins loan officer drift in superseded proposal', () => {
    expect(keyDrift(AG1_DETAIL_SAMPLE_SUPERSEDED.loanOfficers[0], webUnit.loanOfficers[0])).toEqual({
      onlyInProducer: [
        'displayName',
        'hasOverlay',
        'isSimulated',
        'staffingStatus'
      ],
      onlyInConsumer: [
        'isLoanOfficer',
        'name',
        'status',
        'validFrom'
      ]
    });
  });

  it('records that superseded AG1 severity vocabulary had zero overlap with Web DTO', () => {
    const webAdvisoryValues = Array.from(new Set(CANONICAL_M01_UNITS.map((u) => u.capacityMetrics.advisoryStatus)));
    expect(webAdvisoryValues).toEqual(['NORMAL / TARGET']);
    expect(webAdvisoryValues.filter((v) => AG1_SEVERITIES_SUPERSEDED.includes(v))).toEqual([]);
  });
});

describe('Management Units consumer safety — no live Unit API and visibly synthetic fixture', () => {
  let httpMock: HttpTestingController;
  let routeData$: BehaviorSubject<{ office: any }>;
  let queryParams$: BehaviorSubject<any>;

  const branchOffice = { id: 3, name: 'Thanlyin Branch 01', externalId: 'btk-br-ygn-thl-01', parentId: 2 };
  const stockHeadOffice = { id: 1, name: 'Head Office', externalId: '1', parentId: undefined as number | undefined };

  beforeEach(async () => {
    routeData$ = new BehaviorSubject<{ office: any }>({ office: branchOffice });
    queryParams$ = new BehaviorSubject<any>({});

    await TestBed.configureTestingModule({
      imports: [
        ManagementUnitsTabComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
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
        }
      ]
    }).compileComponents();

    TestBed.inject(FaIconLibrary).addIconPacks(solidIcons.fas);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function render(): ManagementUnitsTabComponent {
    const fixture = TestBed.createComponent(ManagementUnitsTabComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('issues no HTTP request in live mode, even when a branch externalId matches a fixture branchKey', () => {
    const component = render();
    expect(component.isDemoMode).toBe(false);
    expect(component.branchUnits).toEqual([]);
    expect(component.allUnits).toEqual([]);
    expect(httpMock.match(() => true).length).toBe(0);
  });

  it('issues no HTTP request in demo mode (fixture is local, never fetched from /api/v1/units)', () => {
    queryParams$.next({ demo: 'true' });
    const component = render();
    expect(component.isDemoMode).toBe(true);
    expect(component.branchUnits.length).toBe(1);
    expect(httpMock.match((req) => req.url.includes('/api/v1/units')).length).toBe(0);
    expect(httpMock.match(() => true).length).toBe(0);
  });

  it('shows no units for the stock default-tenant Head Office in live mode', () => {
    routeData$.next({ office: stockHeadOffice });
    const component = render();
    expect(component.isHeadOffice).toBe(true);
    expect(component.branchUnits).toEqual([]);
    expect(component.allUnits).toEqual([]);
  });

  it('keeps every demo fixture unit PLANNED and visibly synthetic BTK staging data', () => {
    expect(CANONICAL_M01_UNITS.length).toBe(5);
    for (const unit of CANONICAL_M01_UNITS) {
      expect(unit.status).toBe('PLANNED');
      expect(unit.unitKey.startsWith('btk-unit-')).toBe(true);
      expect(unit.branchKey.startsWith('btk-br-')).toBe(true);
      expect(unit.manager.staffExternalId).toContain('-STG-STAFF-');
      for (const lo of unit.loanOfficers) {
        expect(lo.staffExternalId).toContain('-STG-STAFF-');
      }
    }
  });
});
