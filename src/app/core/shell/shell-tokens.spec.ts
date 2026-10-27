/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as fs from 'fs';
import * as path from 'path';
import { describe, expect, it } from '@jest/globals';

describe('Shell Design Tokens Bridge (WEB-365)', () => {
  const designTokensPath = path.resolve(__dirname, '../../../assets/styles/_design-tokens.scss');
  const designTokensContent = fs.readFileSync(designTokensPath, 'utf8');

  it('should define backward compatibility bridge from --mo-* to canonical --ops-* tokens in :root and .dark-theme', () => {
    const expectedTokens = [
      '--mo-primary: var(--ops-primary);',
      '--mo-primary-light: var(--ops-primary-container);',
      '--mo-focus-outline: var(--ops-primary);',
      '--mo-text-primary: var(--ops-text-primary);',
      '--mo-text-secondary: var(--ops-text-secondary);',
      '--mo-border-subtle: var(--ops-border);',
      '--mo-shadow-md: var(--ops-shadow-md);',
      '--mo-surface-hover: var(--ops-surface-alt);'
    ];

    for (const tokenDef of expectedTokens) {
      expect(designTokensContent).toContain(tokenDef);
    }
  });

  it('should prioritize --ops-* tokens in sidenav component styles with --mo-* fallbacks', () => {
    const sidenavScssPath = path.resolve(__dirname, 'sidenav/sidenav.component.scss');
    const sidenavScss = fs.readFileSync(sidenavScssPath, 'utf8');

    expect(sidenavScss).toContain('var(--ops-primary, var(--mo-primary, #0052cc))');
    expect(sidenavScss).toContain('var(--ops-primary-container, var(--mo-primary-light, rgb(0 82 204 / 8%)))');
    expect(sidenavScss).toContain('var(--ops-text-primary, var(--mo-text-primary, #0f172a))');
    expect(sidenavScss).toContain('var(--ops-text-secondary, var(--mo-text-secondary, #64748b))');
    expect(sidenavScss).toContain('var(--ops-surface-alt, var(--mo-surface-hover, rgb(0 0 0 / 4%)))');
    expect(sidenavScss).toContain('var(--ops-border, var(--mo-border-subtle, #e2e8f0))');
  });

  it('should prioritize --ops-* tokens in toolbar component styles', () => {
    const toolbarScssPath = path.resolve(__dirname, 'toolbar/toolbar.component.scss');
    const toolbarScss = fs.readFileSync(toolbarScssPath, 'utf8');

    expect(toolbarScss).toContain('var(--ops-primary, #0e6251)');
    expect(toolbarScss).toContain('var(--ops-shadow-sm, 0 2px 4px rgb(15 23 42 / 6%))');
  });
});
