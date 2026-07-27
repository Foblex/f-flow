import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

/**
 * Freshness guard for the human and LLM-facing canonical docs.
 *
 * These files are primary context for people and coding agents using
 * @foblex/flow, so silent drift directly translates into wrong generated
 * code. This validator fails the build when:
 *
 * 1. The version stated in llms.txt / llms-full.txt does not match the package.
 * 2. A phrase that calls a major line "current" names a stale major.
 * 3. A docs guide registered in docs.pages.ts is not linked from llms.txt.
 * 4. A critical app-facing API symbol is not mentioned in llms-full.txt.
 * 5. A canonical quickstart uses deprecated connector aliases.
 * 6. LLM docs freeze a changing weekly-download number into source control.
 *
 * Deprecated APIs remain documented in their migration and reference sections;
 * only canonical quickstarts are required to use the current unified API.
 *
 * Runs as part of `npm run seo:check` (prebuild).
 */

const MODULE_PATH = fileURLToPath(import.meta.url);

/**
 * App-facing symbols every agent must be able to find in llms-full.txt.
 * Extend this list when a new public feature ships — the AGENT.md release
 * checklist points here.
 */
export const REQUIRED_SYMBOLS = [
  'FFlowModule',
  'provideFFlow',
  'fDraggable',
  'fZoom',
  'fConnector',
  'fSourceId',
  'fTargetId',
  'fNodePosition',
  'fCache',
  'fNodeRenderLimit',
  'f-selection-area',
  'withControlScheme',
  'withReflowOnResize',
  'withFCanvas',
  'EFCanvasLayer',
  'fVirtualFor',
  'FCreateConnectionEvent',
  'FDeleteSelectedEvent',
  'ngProjectAs',
  'withConnectionFlow',
  'withA11y',
  'withFlowState',
  'FFlowState',
  'injectFlowState',
  'ViewEncapsulation.ShadowDom',
  'DagreLayoutEngine',
  '@foblex/flow-dagre-layout',
  '@foblex/flow-elk-layout',
  'resetScaleAndCenterGroupOrNode',
];

const QUICKSTART_REQUIRED_SYMBOLS = ['fConnector', 'fConnectorId', 'fSourceId', 'fTargetId'];
const QUICKSTART_DEPRECATED_SYMBOLS = ['fNodeOutput', 'fNodeInput', 'fOutputId', 'fInputId'];
const CONTEXT_REQUIRED_SYMBOLS = [
  'Classic mode',
  'Managed mode',
  'withFlowState',
  'fConnector',
  'fConnectorId',
  'fSourceId',
  'fTargetId',
];

if (process.argv[1] && resolve(process.argv[1]) === MODULE_PATH) {
  validateRepository(process.cwd());
}

export function validateRepository(root) {
  const paths = {
    llms: join(root, 'apps', 'f-flow-portal', 'public', 'llms.txt'),
    llmsFull: join(root, 'apps', 'f-flow-portal', 'public', 'llms-full.txt'),
    docsPages: join(
      root,
      'apps',
      'f-flow-portal',
      'src',
      'app',
      'sections',
      'docs',
      'docs.pages.ts',
    ),
    package: join(root, 'libs', 'f-flow', 'package.json'),
    readme: join(root, 'README.md'),
    packageReadme: join(root, 'libs', 'f-flow', 'README.md'),
    aiGuide: join(root, 'libs', 'f-flow', 'AI.md'),
    getStarted: join(
      root,
      'apps',
      'f-flow-portal',
      'public',
      'markdown',
      'guides',
      'introduction',
      'get-started.md',
    ),
    compatibility: join(
      root,
      'apps',
      'f-flow-portal',
      'public',
      'markdown',
      'guides',
      'introduction',
      'angular-version-compatibility.md',
    ),
    context7: join(root, 'context7.json'),
  };

  const content = Object.fromEntries(
    Object.entries(paths)
      .filter(([name]) => name !== 'package')
      .map(([name, path]) => [name, readFileSync(path, 'utf8')]),
  );
  const version = JSON.parse(readFileSync(paths.package, 'utf8')).version;
  const issues = collectIssues({ ...content, version });

  if (issues.length) {
    console.error('LLM docs validation failed:\n');
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    console.error(
      '\nUpdate the canonical human/LLM docs (see AGENT.md, "AI documentation maintenance").',
    );
    process.exitCode = 1;

    return;
  }

  console.log(
    `LLM docs validation passed: v${version}, ${extractDocsSlugs(content.docsPages).length} docs links, ${REQUIRED_SYMBOLS.length} API symbols, 5 current quickstarts.`,
  );
}

export function collectIssues({
  llms,
  llmsFull,
  docsPages,
  readme,
  packageReadme,
  aiGuide,
  getStarted,
  compatibility,
  context7,
  version,
}) {
  const issues = [];
  const currentMajor = Number.parseInt(version.split('.')[0], 10);

  for (const [name, source] of [
    ['llms.txt', llms],
    ['llms-full.txt', llmsFull],
  ]) {
    if (!source.includes(`v${version}`)) {
      issues.push(
        `${name}: stated version does not match libs/f-flow/package.json (expected v${version})`,
      );
    }
    issues.push(...findHardcodedWeeklyMetricIssues(name, source));
  }

  for (const [name, source] of [
    ['README.md', readme],
    ['libs/f-flow/README.md', packageReadme],
    ['llms.txt', llms],
    ['llms-full.txt', llmsFull],
    ['get-started.md', getStarted],
    ['angular-version-compatibility.md', compatibility],
  ]) {
    issues.push(...findStaleCurrentMajorIssues(name, source, currentMajor));
  }

  for (const slug of extractDocsSlugs(docsPages)) {
    if (!llms.includes(`/docs/${slug})`)) {
      issues.push(`llms.txt: docs page /docs/${slug} is not linked`);
    }
  }

  for (const symbol of REQUIRED_SYMBOLS) {
    if (!containsSymbol(llmsFull, symbol)) {
      issues.push(`llms-full.txt: required API symbol "${symbol}" is not mentioned`);
    }
  }

  for (const quickstart of [
    ['README.md', readme, '## Minimal Example'],
    ['libs/f-flow/README.md', packageReadme, '## Minimal Example'],
    ['libs/f-flow/AI.md', aiGuide, '## Minimal Working Setup'],
    ['llms-full.txt', llmsFull, '## 5. Minimal working example'],
    ['get-started.md', getStarted, '## Minimal flow template'],
  ]) {
    issues.push(...validateCanonicalQuickstart(...quickstart));
  }

  for (const symbol of CONTEXT_REQUIRED_SYMBOLS) {
    if (!context7.includes(symbol)) {
      issues.push(`context7.json: current guidance must mention "${symbol}"`);
    }
  }
  if (/fOutputId\s*(?:→|->)\s*fInputId/u.test(context7)) {
    issues.push(
      'context7.json: connector guidance uses deprecated fOutputId -> fInputId mapping; use fSourceId/fTargetId referencing fConnectorId',
    );
  }

  return issues;
}

export function findStaleCurrentMajorIssues(name, source, currentMajor) {
  const issues = [];
  const pattern = /\bcurrent\s+(?:stable\s+)?(?:release(?:s)?\s+)?`?v?(?<major>\d+)\.x`?/giu;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const statedMajor = Number.parseInt(match.groups.major, 10);
    if (statedMajor !== currentMajor) {
      issues.push(
        `${name}: "${match[0]}" names a stale current major (expected current ${currentMajor}.x)`,
      );
    }
  }

  return issues;
}

export function findHardcodedWeeklyMetricIssues(name, source) {
  const pattern = /\bweekly\s+(?:installs|downloads)\b[^\n\d]{0,30}[~≈]?\d[\d,.]*[KkMm]?/giu;

  return pattern.test(source)
    ? [`${name}: do not hardcode weekly install/download counts; link to npm instead`]
    : [];
}

export function validateCanonicalQuickstart(name, source, heading) {
  const section = extractMarkdownSection(source, heading);
  if (section === null) {
    return [`${name}: canonical quickstart heading "${heading}" was not found`];
  }

  const issues = [];
  for (const symbol of QUICKSTART_REQUIRED_SYMBOLS) {
    if (!containsSymbol(section, symbol)) {
      issues.push(`${name}: canonical quickstart must use "${symbol}"`);
    }
  }
  for (const symbol of QUICKSTART_DEPRECATED_SYMBOLS) {
    if (new RegExp(`\\b${symbol}\\b`, 'u').test(section)) {
      issues.push(`${name}: canonical quickstart uses deprecated "${symbol}"`);
    }
  }

  return issues;
}

export function extractMarkdownSection(source, heading) {
  const start = source.indexOf(heading);
  if (start === -1) {
    return null;
  }

  const afterHeading = start + heading.length;
  const nextHeading = /^##\s+/gmu;
  nextHeading.lastIndex = afterHeading;
  const match = nextHeading.exec(source);

  return source.slice(start, match?.index ?? source.length);
}

function containsSymbol(source, symbol) {
  const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

  return new RegExp(`(?<![A-Za-z0-9_$])${escaped}(?![A-Za-z0-9_$])`, 'u').test(source);
}

export function extractDocsSlugs(source) {
  const slugs = [];
  const pattern = /slug:\s*'([^']+)'/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    // External links (full URLs) are sidebar-only entries, not portal pages.
    if (!match[1].startsWith('http')) {
      slugs.push(match[1]);
    }
  }

  return slugs;
}
