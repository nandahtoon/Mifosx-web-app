/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { ChangeDetectionStrategy, Component, inject, DestroyRef, ChangeDetectorRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { environment } from 'environments/environment';

export interface ManagementUnit {
  unitKey: string;
  name: string;
  branchKey: string;
  branchName: string;
  status: 'PLANNED' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  capacityPolicyRef: string;
  validFrom: string;
  validTo: string | null;
  targetLoanOfficerPositions: number;
  staffedLoanOfficerPositions: number;
  manager: {
    positionKey: string;
    staffExternalId: string;
    name: string;
    assignmentType: 'PERMANENT' | 'TEMPORARY' | 'ACTING';
    status: 'ACTIVE';
    validFrom: string;
    reason: string;
  };
  loanOfficers: Array<{
    positionKey: string;
    staffExternalId: string;
    name: string;
    assignmentType: 'PERMANENT' | 'TEMPORARY' | 'ACTING';
    status: 'ACTIVE';
    validFrom: string;
    isLoanOfficer: boolean;
  }>;
  capacityMetrics: {
    activeClients: number;
    activeGroups: number;
    activeCenters: number;
    portfolioSignal: 'HEALTHY' | 'WARNING' | 'BREACH';
    advisoryStatus: 'NORMAL / TARGET' | 'WARNING' | 'HARD BREACH';
  };
}

/** Canonical M01 5-Unit Synthetic Dataset per accepted Program #124 Contract */
export const CANONICAL_M01_UNITS: ManagementUnit[] = [
  {
    unitKey: 'btk-unit-ygn-thl-01-01',
    name: 'Thanlyin Branch 01 Unit 01',
    branchKey: 'btk-br-ygn-thl-01',
    branchName: 'Thanlyin Branch 01',
    status: 'PLANNED',
    capacityPolicyRef: 'default-management-unit',
    validFrom: '2016-01-01',
    validTo: null,
    targetLoanOfficerPositions: 4,
    staffedLoanOfficerPositions: 4,
    manager: {
      positionKey: 'btk-unit-ygn-thl-01-01-manager',
      staffExternalId: 'BTK-STG-STAFF-YGN-THL-01-MGR',
      name: 'Unit Manager Thanlyin 01',
      assignmentType: 'PERMANENT',
      status: 'ACTIVE',
      validFrom: '2016-01-01',
      reason: 'BTK permanent Unit Manager home posting'
    },
    loanOfficers: [
      {
        positionKey: 'btk-unit-ygn-thl-01-01-lo-01',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-01-LO-01',
        name: 'Loan Officer THL 01-01',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-thl-01-01-lo-02',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-01-LO-02',
        name: 'Loan Officer THL 01-02',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-thl-01-01-lo-03',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-01-LO-03',
        name: 'Loan Officer THL 01-03',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-thl-01-01-lo-04',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-01-LO-04',
        name: 'Loan Officer THL 01-04',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      }
    ],
    capacityMetrics: {
      activeClients: 120,
      activeGroups: 24,
      activeCenters: 6,
      portfolioSignal: 'HEALTHY',
      advisoryStatus: 'NORMAL / TARGET'
    }
  },
  {
    unitKey: 'btk-unit-ygn-thl-02-01',
    name: 'Thanlyin Branch 02 Unit 01',
    branchKey: 'btk-br-ygn-thl-02',
    branchName: 'Thanlyin Branch 02',
    status: 'PLANNED',
    capacityPolicyRef: 'default-management-unit',
    validFrom: '2016-01-01',
    validTo: null,
    targetLoanOfficerPositions: 4,
    staffedLoanOfficerPositions: 4,
    manager: {
      positionKey: 'btk-unit-ygn-thl-02-01-manager',
      staffExternalId: 'BTK-STG-STAFF-YGN-THL-02-MGR',
      name: 'Unit Manager Thanlyin 02',
      assignmentType: 'PERMANENT',
      status: 'ACTIVE',
      validFrom: '2016-01-01',
      reason: 'BTK permanent Unit Manager home posting'
    },
    loanOfficers: [
      {
        positionKey: 'btk-unit-ygn-thl-02-01-lo-01',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-02-LO-01',
        name: 'Loan Officer THL 02-01',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-thl-02-01-lo-02',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-02-LO-02',
        name: 'Loan Officer THL 02-02',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-thl-02-01-lo-03',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-02-LO-03',
        name: 'Loan Officer THL 02-03',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-thl-02-01-lo-04',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-02-LO-04',
        name: 'Loan Officer THL 02-04',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      }
    ],
    capacityMetrics: {
      activeClients: 115,
      activeGroups: 23,
      activeCenters: 5,
      portfolioSignal: 'HEALTHY',
      advisoryStatus: 'NORMAL / TARGET'
    }
  },
  {
    unitKey: 'btk-unit-ygn-thl-03-01',
    name: 'Thanlyin Branch 03 Unit 01',
    branchKey: 'btk-br-ygn-thl-03',
    branchName: 'Thanlyin Branch 03',
    status: 'PLANNED',
    capacityPolicyRef: 'default-management-unit',
    validFrom: '2016-01-01',
    validTo: null,
    targetLoanOfficerPositions: 4,
    staffedLoanOfficerPositions: 4,
    manager: {
      positionKey: 'btk-unit-ygn-thl-03-01-manager',
      staffExternalId: 'BTK-STG-STAFF-YGN-THL-03-MGR',
      name: 'Unit Manager Thanlyin 03',
      assignmentType: 'PERMANENT',
      status: 'ACTIVE',
      validFrom: '2016-01-01',
      reason: 'BTK permanent Unit Manager home posting'
    },
    loanOfficers: [
      {
        positionKey: 'btk-unit-ygn-thl-03-01-lo-01',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-03-LO-01',
        name: 'Loan Officer THL 03-01',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-thl-03-01-lo-02',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-03-LO-02',
        name: 'Loan Officer THL 03-02',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-thl-03-01-lo-03',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-03-LO-03',
        name: 'Loan Officer THL 03-03',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-thl-03-01-lo-04',
        staffExternalId: 'BTK-STG-STAFF-YGN-THL-03-LO-04',
        name: 'Loan Officer THL 03-04',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      }
    ],
    capacityMetrics: {
      activeClients: 108,
      activeGroups: 21,
      activeCenters: 5,
      portfolioSignal: 'HEALTHY',
      advisoryStatus: 'NORMAL / TARGET'
    }
  },
  {
    unitKey: 'btk-unit-ygn-twt-01-01',
    name: 'Twantay Branch 01 Unit 01',
    branchKey: 'btk-br-ygn-twt-01',
    branchName: 'Twantay Branch 01',
    status: 'PLANNED',
    capacityPolicyRef: 'default-management-unit',
    validFrom: '2016-01-01',
    validTo: null,
    targetLoanOfficerPositions: 4,
    staffedLoanOfficerPositions: 4,
    manager: {
      positionKey: 'btk-unit-ygn-twt-01-01-manager',
      staffExternalId: 'BTK-STG-STAFF-YGN-TWT-01-MGR',
      name: 'Unit Manager Twantay 01',
      assignmentType: 'PERMANENT',
      status: 'ACTIVE',
      validFrom: '2016-01-01',
      reason: 'BTK permanent Unit Manager home posting'
    },
    loanOfficers: [
      {
        positionKey: 'btk-unit-ygn-twt-01-01-lo-01',
        staffExternalId: 'BTK-STG-STAFF-YGN-TWT-01-LO-01',
        name: 'Loan Officer TWT 01-01',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-twt-01-01-lo-02',
        staffExternalId: 'BTK-STG-STAFF-YGN-TWT-01-LO-02',
        name: 'Loan Officer TWT 01-02',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-twt-01-01-lo-03',
        staffExternalId: 'BTK-STG-STAFF-YGN-TWT-01-LO-03',
        name: 'Loan Officer TWT 01-03',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-twt-01-01-lo-04',
        staffExternalId: 'BTK-STG-STAFF-YGN-TWT-01-LO-04',
        name: 'Loan Officer TWT 01-04',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      }
    ],
    capacityMetrics: {
      activeClients: 130,
      activeGroups: 26,
      activeCenters: 6,
      portfolioSignal: 'HEALTHY',
      advisoryStatus: 'NORMAL / TARGET'
    }
  },
  {
    unitKey: 'btk-unit-ygn-twt-02-01',
    name: 'Twantay Branch 02 Unit 01',
    branchKey: 'btk-br-ygn-twt-02',
    branchName: 'Twantay Branch 02',
    status: 'PLANNED',
    capacityPolicyRef: 'default-management-unit',
    validFrom: '2016-01-01',
    validTo: null,
    targetLoanOfficerPositions: 4,
    staffedLoanOfficerPositions: 4,
    manager: {
      positionKey: 'btk-unit-ygn-twt-02-01-manager',
      staffExternalId: 'BTK-STG-STAFF-YGN-TWT-02-MGR',
      name: 'Unit Manager Twantay 02',
      assignmentType: 'PERMANENT',
      status: 'ACTIVE',
      validFrom: '2016-01-01',
      reason: 'BTK permanent Unit Manager home posting'
    },
    loanOfficers: [
      {
        positionKey: 'btk-unit-ygn-twt-02-01-lo-01',
        staffExternalId: 'BTK-STG-STAFF-YGN-TWT-02-LO-01',
        name: 'Loan Officer TWT 02-01',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-twt-02-01-lo-02',
        staffExternalId: 'BTK-STG-STAFF-YGN-TWT-02-LO-02',
        name: 'Loan Officer TWT 02-02',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-twt-02-01-lo-03',
        staffExternalId: 'BTK-STG-STAFF-YGN-TWT-02-LO-03',
        name: 'Loan Officer TWT 02-03',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      },
      {
        positionKey: 'btk-unit-ygn-twt-02-01-lo-04',
        staffExternalId: 'BTK-STG-STAFF-YGN-TWT-02-LO-04',
        name: 'Loan Officer TWT 02-04',
        assignmentType: 'PERMANENT',
        status: 'ACTIVE',
        validFrom: '2016-01-01',
        isLoanOfficer: true
      }
    ],
    capacityMetrics: {
      activeClients: 122,
      activeGroups: 24,
      activeCenters: 6,
      portfolioSignal: 'HEALTHY',
      advisoryStatus: 'NORMAL / TARGET'
    }
  }
];

/**
 * Management Units Tab Component — Post-v0.1.0 M01 Operator Surface (Issue #124)
 * Supports Branch -> Management Units -> Unit Detail operator workflow.
 */
@Component({
  selector: 'mifosx-management-units-tab',
  templateUrl: './management-units-tab.component.html',
  styleUrls: ['./management-units-tab.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    FaIconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagementUnitsTabComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  /** Current Office data */
  officeData: any = {};

  /** Units associated with current Branch */
  branchUnits: ManagementUnit[] = [];

  /** All canonical units (available when viewing Head Office / Regional Office in demo mode) */
  allUnits: ManagementUnit[] = [];

  /** Currently selected unit for detail inspection */
  selectedUnit = signal<ManagementUnit | null>(null);

  /** Whether to show all organizational units */
  showAllUnits = signal<boolean>(false);

  constructor() {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: { office?: any }) => {
      this.officeData = data.office || {};
      this.resolveBranchUnits();
      this.cdr.markForCheck();
    });

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.resolveBranchUnits();
      this.cdr.markForCheck();
    });
  }

  get isDemoMode(): boolean {
    const queryDemo = this.route.snapshot?.queryParamMap?.get('demo');
    if (queryDemo === 'true') {
      return true;
    }
    const winEnv = typeof window !== 'undefined' ? (window as any).env : null;
    if (winEnv && (winEnv.demoMode === true || winEnv.demoMode === 'true')) {
      return true;
    }
    return Boolean(environment.demoMode);
  }

  get isHeadOffice(): boolean {
    return !this.officeData?.parentId || this.officeData?.id === 1;
  }

  get isBranchOffice(): boolean {
    return !this.isHeadOffice;
  }

  get hasBranchUnits(): boolean {
    return this.branchUnits.length > 0;
  }

  private resolveBranchUnits(): void {
    if (!this.isDemoMode) {
      this.branchUnits = [];
      this.allUnits = [];
      this.selectedUnit.set(null);
      return;
    }

    this.allUnits = CANONICAL_M01_UNITS;
    const externalId = (this.officeData?.externalId || '').toLowerCase().trim();

    if (this.isHeadOffice) {
      this.branchUnits = [];
      this.selectedUnit.set(null);
      return;
    }

    // In demo mode on a branch office, match only by authoritative externalId
    this.branchUnits = externalId
      ? CANONICAL_M01_UNITS.filter((unit) => unit.branchKey.toLowerCase() === externalId)
      : [];

    if (this.branchUnits.length === 1) {
      this.selectedUnit.set(this.branchUnits[0]);
    } else {
      this.selectedUnit.set(null);
    }
  }

  enableDemoMode(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { demo: 'true' },
      queryParamsHandling: 'merge'
    });
  }

  selectUnit(unit: ManagementUnit): void {
    this.selectedUnit.set(unit);
  }

  clearSelectedUnit(): void {
    if (this.branchUnits.length > 1 || this.showAllUnits() || this.isHeadOffice) {
      this.selectedUnit.set(null);
    }
  }

  toggleShowAllUnits(): void {
    this.showAllUnits.update((v) => !v);
    if (!this.showAllUnits() && this.branchUnits.length > 0) {
      this.selectedUnit.set(this.branchUnits[0]);
    } else {
      this.selectedUnit.set(null);
    }
  }
}
