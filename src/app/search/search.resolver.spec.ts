/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { of, throwError } from 'rxjs';

import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';

describe('SearchResolver', () => {
  let resolver: SearchResolver;
  const searchServiceMock = {
    getSearchResults: jest.fn()
  };

  beforeEach(() => {
    searchServiceMock.getSearchResults.mockReset();

    TestBed.configureTestingModule({
      providers: [
        SearchResolver,
        { provide: SearchService, useValue: searchServiceMock }
      ]
    });

    resolver = TestBed.inject(SearchResolver);
  });

  it('should return empty array when query parameter is missing', (done) => {
    const routeSnapshot = {
      queryParams: {}
    } as unknown as ActivatedRouteSnapshot;

    resolver.resolve(routeSnapshot).subscribe((results) => {
      expect(results).toEqual([]);
      expect(searchServiceMock.getSearchResults).not.toHaveBeenCalled();
      done();
    });
  });

  it('should call SearchService when query parameter is present', (done) => {
    const mockResults = [{ entityId: 1, entityName: 'Test Client', entityType: 'CLIENT' }];
    searchServiceMock.getSearchResults.mockReturnValue(of(mockResults));

    const routeSnapshot = {
      queryParams: { query: 'Test', resource: 'clients' }
    } as unknown as ActivatedRouteSnapshot;

    resolver.resolve(routeSnapshot).subscribe((results) => {
      expect(results).toEqual(mockResults);
      expect(searchServiceMock.getSearchResults).toHaveBeenCalledWith('Test', 'clients');
      done();
    });
  });

  it('should catch error and return empty array when search fails', (done) => {
    searchServiceMock.getSearchResults.mockReturnValue(throwError(() => new Error('Search API down')));

    const routeSnapshot = {
      queryParams: { query: 'Failed' }
    } as unknown as ActivatedRouteSnapshot;

    resolver.resolve(routeSnapshot).subscribe((results) => {
      expect(results).toEqual([]);
      done();
    });
  });
});
