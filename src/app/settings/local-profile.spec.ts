/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { SettingsService } from './settings.service';
import { ErrorHandlerInterceptor } from '../core/http/error-handler.interceptor';
import { AlertService } from '../core/alert/alert.service';

describe('MicroOps opt-in local profile', () => {
  const original = { ...environment };

  afterEach(() => {
    Object.assign(environment, original);
    jest.restoreAllMocks();
  });

  function proxy(port?: string) {
    const context = { module: { exports: {} }, process: { env: port === undefined ? {} : { APISIX_HTTP_PORT: port } } };
    runInNewContext(readFileSync('proxy.microops.local.conf.js', 'utf8'), context);
    return context.module.exports as Record<string, { target: string; changeOrigin: boolean }>;
  }

  it('routes only the unchanged Fineract path to loopback, including an explicit port override', () => {
    expect(proxy()).toEqual({ '/fineract-provider/**': { target: 'http://127.0.0.1:9080', changeOrigin: true } });
    expect(proxy('19080')['/fineract-provider/**'].target).toBe('http://127.0.0.1:19080');
  });

  it.each([
    '0',
    '65536',
    '-1',
    '9080/path',
    'https://example.org',
    '9080.5'
  ])('rejects invalid port %s', (port) => {
    expect(() => proxy(port)).toThrow('APISIX_HTTP_PORT');
  });

  it('loads a separate same-origin, single-tenant runtime asset with optional integrations off', () => {
    const context = { window: { location: { origin: 'http://localhost:4200' }, env: {} as Record<string, unknown> } };
    runInNewContext(readFileSync('src/environments/microops-local/env.js', 'utf8'), context);
    expect(context.window.env).toMatchObject({
      fineractApiUrl: 'http://localhost:4200',
      fineractApiUrls: 'http://localhost:4200',
      fineractPlatformTenantId: 'default',
      fineractPlatformTenantIds: 'default',
      allowServerSwitch: false,
      displayTenantSelector: false,
      demoMode: false
    });
    for (const key of [
      'enableCopilot',
      'mifosRemittanceEnabled',
      'mifosInterbankTransfersEnabled',
      'enableExternalNationalIdSystem',
      'enablePostalCodeLookup',
      'oauthServerEnabled',
      'oidcServerEnabled'
    ]) {
      expect(context.window.env[key]).toBe(false);
    }
    const workspace = JSON.parse(readFileSync('angular.json', 'utf8')).projects['mifosx-web-app'].architect;
    expect(workspace.serve.configurations['microops-local'].buildTarget).toBe(
      'mifosx-web-app:build:development,microops-local'
    );
    const assets = workspace.build.configurations['microops-local'].assets;
    expect(assets).toContainEqual({ glob: '**/*', input: 'src/assets', output: 'assets', ignore: [
        'env.js',
        'env.template.js'
      ] });
    expect(assets).toContainEqual({ glob: 'env.js', input: 'src/environments/microops-local', output: 'assets' });
  });

  it('ignores stale server and tenant preferences when deployment selectors are disabled', () => {
    jest.spyOn(localStorage, 'getItem').mockImplementation(
      (key) =>
        ({
          mifosXServerURL: 'https://stale.example',
          mifosXTenantIdentifier: 'stale-tenant'
        })[key] ?? null
    );
    Object.assign(environment, {
      allowServerSwitch: 'false',
      displayTenantSelector: 'false',
      baseApiUrl: 'http://localhost:4200',
      fineractPlatformTenantId: 'default'
    });
    const settings = Object.create(SettingsService.prototype) as SettingsService;
    expect(settings.serverUrl).toBe('http://localhost:4200/fineract-provider/api/v1');
    expect(settings.tenantIdentifier).toBe('default');
    Object.assign(environment, { allowServerSwitch: 'true', displayTenantSelector: 'true' });
    expect(settings.server).toBe('https://stale.example');
    expect(settings.tenantIdentifier).toBe('stale-tenant');
  });
});

describe('Negative transport and error handling scenarios [TEST evidence - synthetic/mocked transport; not live host proof]', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let alertService: AlertService;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        AlertService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorHandlerInterceptor,
          multi: true
        }
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    alertService = TestBed.inject(AlertService);
    alertSpy = jest.spyOn(alertService, 'alert');
  });

  afterEach(() => {
    httpMock.verify();
    jest.restoreAllMocks();
  });

  it('handles 401 Unauthorized negative response gracefully [TEST evidence]', async () => {
    const promise = firstValueFrom(httpClient.get('/fineract-provider/api/v1/offices'));
    const req = httpMock.expectOne('/fineract-provider/api/v1/offices');
    req.flush({ developerMessage: 'Unauthenticated' }, { status: 401, statusText: 'Unauthorized' });

    await expect(promise).rejects.toMatchObject({ status: 401 });
    expect(alertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'errors.error.auth.type',
        message: 'errors.error.auth.message'
      })
    );
  });

  it('handles 403 Forbidden negative response gracefully [TEST evidence]', async () => {
    const promise = firstValueFrom(httpClient.get('/fineract-provider/api/v1/offices'));
    const req = httpMock.expectOne('/fineract-provider/api/v1/offices');
    req.flush({ developerMessage: 'Access Denied' }, { status: 403, statusText: 'Forbidden' });

    await expect(promise).rejects.toMatchObject({ status: 403 });
    expect(alertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'errors.error.unauthorized.type'
      })
    );
  });

  it('handles status 0 (unreachable / network offline / connection refused) gracefully [TEST evidence]', async () => {
    const promise = firstValueFrom(httpClient.get('/fineract-provider/api/v1/offices'));
    const req = httpMock.expectOne('/fineract-provider/api/v1/offices');
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    await expect(promise).rejects.toMatchObject({ status: 0 });
    expect(alertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'errors.error.unknown.type'
      })
    );
  });

  it('handles 504 Gateway Timeout gracefully [TEST evidence]', async () => {
    const promise = firstValueFrom(httpClient.get('/fineract-provider/api/v1/offices'));
    const req = httpMock.expectOne('/fineract-provider/api/v1/offices');
    req.flush({ developerMessage: 'Gateway Timeout' }, { status: 504, statusText: 'Gateway Timeout' });

    await expect(promise).rejects.toMatchObject({ status: 504 });
    expect(alertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'errors.error.unknown.type'
      })
    );
  });
});
