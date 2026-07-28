import { before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUTPUT_ROOT = join(ROOT, 'tmp', 'github-pages-redirect');
const GENERATOR = join(ROOT, 'scripts', 'generate-github-pages-redirects.mjs');

describe('Legacy GitHub Pages redirects', () => {
  before(() => {
    execFileSync(process.execPath, [GENERATOR], { cwd: ROOT, stdio: 'pipe' });
  });

  test('home redirects to the canonical portal', () => {
    const html = readFileSync(join(OUTPUT_ROOT, 'index.html'), 'utf8');

    assert.match(html, /<link rel="canonical" href="https:\/\/flow\.foblex\.com\/">/u);
    assert.match(html, /http-equiv="refresh" content="0;url=https:\/\/flow\.foblex\.com\/"/u);
    assert.match(html, /window\.location\.replace/u);
    assert.doesNotMatch(html, /Angular 12|Flow-Chart Library/u);
  });

  test('known deep links keep their canonical destination', () => {
    const docsHtml = readFileSync(join(OUTPUT_ROOT, 'docs', 'get-started', 'index.html'), 'utf8');
    const legacyDocsHtml = readFileSync(
      join(OUTPUT_ROOT, 'docs', 'en', 'get-started', 'index.html'),
      'utf8',
    );

    for (const html of [docsHtml, legacyDocsHtml]) {
      assert.match(
        html,
        /<link rel="canonical" href="https:\/\/flow\.foblex\.com\/docs\/get-started">/u,
      );
      assert.match(html, /window\.location\.search \+ window\.location\.hash/u);
    }
  });

  test('renamed routes point to their current page', () => {
    const html = readFileSync(
      join(OUTPUT_ROOT, 'examples', 'f-db-management-flow', 'index.html'),
      'utf8',
    );

    assert.match(html, /https:\/\/flow\.foblex\.com\/examples\/schema-designer/u);
  });

  test('fallback strips the project prefix and maps legacy docs', () => {
    const html = readFileSync(join(OUTPUT_ROOT, '404.html'), 'utf8');

    assert.match(html, /var projectPrefix = '\/f-flow'/u);
    assert.match(html, /pathname\.startsWith\('\/docs\/en\/'\)/u);
    assert.match(html, /window\.location\.replace/u);
  });

  test('artifact contains redirect pages instead of the old application', () => {
    const topLevelEntries = readdirSync(OUTPUT_ROOT);

    assert.ok(topLevelEntries.includes('index.html'));
    assert.ok(topLevelEntries.includes('404.html'));
    assert.ok(topLevelEntries.includes('.nojekyll'));
    assert.ok(!topLevelEntries.includes('main.js'));
  });
});
