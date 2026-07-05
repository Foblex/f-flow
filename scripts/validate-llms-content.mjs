import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Freshness guard for the LLM-facing docs (llms.txt / llms-full.txt).
 *
 * These files are the primary context AI agents load before generating code
 * against @foblex/flow, so silent drift directly translates into wrong
 * generated code. This validator fails the build when:
 *
 * 1. The version stated in either file does not match libs/f-flow/package.json.
 * 2. A docs guide page registered in docs.pages.ts is not linked from llms.txt.
 * 3. A critical app-facing API symbol is not mentioned in llms-full.txt.
 *
 * Runs as part of `npm run seo:check` (prebuild).
 */

const ROOT = process.cwd();
const LLMS_PATH = join(ROOT, 'apps', 'f-flow-portal', 'public', 'llms.txt');
const LLMS_FULL_PATH = join(ROOT, 'apps', 'f-flow-portal', 'public', 'llms-full.txt');
const DOCS_PAGES_PATH = join(
  ROOT,
  'apps',
  'f-flow-portal',
  'src',
  'app',
  'sections',
  'docs',
  'docs.pages.ts',
);
const PACKAGE_PATH = join(ROOT, 'libs', 'f-flow', 'package.json');

/**
 * App-facing symbols every agent must be able to find in llms-full.txt.
 * Extend this list when a new public feature ships — the AGENT.md release
 * checklist points here.
 */
const REQUIRED_SYMBOLS = [
  'FFlowModule',
  'provideFFlow',
  'fDraggable',
  'fZoom',
  'fConnector',
  'fSourceId',
  'fTargetId',
  'fNodePosition',
  'f-selection-area',
  'withControlScheme',
  'withReflowOnResize',
  'withFCanvas',
  'EFCanvasLayer',
  'fVirtualFor',
  'FCreateConnectionEvent',
  'ngProjectAs',
  'withConnectionFlow',
  'withA11y',
];

const llms = readFileSync(LLMS_PATH, 'utf8');
const llmsFull = readFileSync(LLMS_FULL_PATH, 'utf8');
const docsPages = readFileSync(DOCS_PAGES_PATH, 'utf8');
const version = JSON.parse(readFileSync(PACKAGE_PATH, 'utf8')).version;

const issues = [];

for (const [name, content] of [
  ['llms.txt', llms],
  ['llms-full.txt', llmsFull],
]) {
  if (!content.includes(`v${version}`)) {
    issues.push(
      `${name}: stated version does not match libs/f-flow/package.json (expected v${version})`,
    );
  }
}

for (const slug of extractDocsSlugs(docsPages)) {
  if (!llms.includes(`/docs/${slug})`)) {
    issues.push(`llms.txt: docs page /docs/${slug} is not linked`);
  }
}

for (const symbol of REQUIRED_SYMBOLS) {
  if (!llmsFull.includes(symbol)) {
    issues.push(`llms-full.txt: required API symbol "${symbol}" is not mentioned`);
  }
}

if (issues.length) {
  console.error('LLM docs validation failed:\n');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  console.error(
    '\nUpdate apps/f-flow-portal/public/llms.txt / llms-full.txt (see AGENT.md, "AI documentation maintenance").',
  );
  process.exit(1);
}

console.log(
  `LLM docs validation passed: v${version}, ${extractDocsSlugs(docsPages).length} docs links, ${REQUIRED_SYMBOLS.length} API symbols.`,
);

function extractDocsSlugs(source) {
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
