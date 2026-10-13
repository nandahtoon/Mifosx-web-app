/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { execFileSync } from 'node:child_process';
import { THEME_PRESETS } from './theming.service';

const luminance = (rgb: number[]) =>
  rgb
    .map((value) => value / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))
    .reduce(
      (sum, value, index) => sum + value * [
            0.2126,
            0.7152,
            0.0722
          ][index],
      0
    );
const rgb = (hex: string) =>
  hex
    .replace('#', '')
    .match(/../g)
    .map((part) => parseInt(part, 16));
const contrast = (a: number[], b: number[]) =>
  (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);

describe('Ocean Material button contrast', () => {
  const source = `
    @use 'sass:map';
    @use 'microops-presets' as presets;
    .contrast-regression {
      --light: #{map.get(presets.$ocean-corporate-light-primary, 500)};
      --dark: #{map.get(presets.$ocean-corporate-dark-primary, 500)};
      --dark-on: #{map.get(map.get(presets.$ocean-corporate-dark-primary, contrast), 500)};
    }
  `;
  // Compile outside Angular/jsdom because Sass needs native filesystem APIs.
  const css = execFileSync(
    process.execPath,
    [
      '-e',
      'const sass = require("sass"); process.stdout.write(sass.compileString(process.argv[1], {loadPaths: ["src/theme", "node_modules"], logger: sass.Logger.silent}).css);',
      source
    ],
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
  );
  const token = (name: string) => css.match(new RegExp(`--${name}: (#[a-f0-9]+);`))[1];

  it('keeps light normal text above 4.5:1 including a conservative white state overlay', () => {
    const background = rgb(token('light'));
    expect(contrast(rgb('#ffffff'), background)).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast(
        rgb('#ffffff'),
        background.map((value) => value * 0.88 + 255 * 0.12)
      )
    ).toBeGreaterThanOrEqual(4.5);
    expect(THEME_PRESETS.find((preset) => preset.id === 'ocean-corporate').primaryLight).toBe(token('light'));
  });

  it('preserves the dark-mode on-color pair above 4.5:1', () => {
    expect(contrast(rgb(token('dark-on')), rgb(token('dark')))).toBeGreaterThanOrEqual(4.5);
  });
});
