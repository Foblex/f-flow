// Build the portal's semantic search index. Reads every PageDefinition
// across docs/examples/blog/showcase, fetches the matching markdown
// file, generates a sentence-embedding vector per page using a quantised
// MiniLM model, and writes the result to
// `apps/f-flow-portal/public/search-index.json`.
//
// At runtime the browser lazy-loads the same model via
// @huggingface/transformers, embeds the user's query, and ranks pages
// by cosine similarity to the precomputed vectors. No server, no API
// key, no per-query cost.
//
// Usage:
//   node scripts/build-search-index.mjs
//   npx nx run portal:build-search-index   (wired to depend on portal:build)

import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = process.cwd();
const MD_ROOT = path.join(REPO_ROOT, 'apps/f-flow-portal/public/markdown');
const SECTIONS_ROOT = path.join(REPO_ROOT, 'apps/f-flow-portal/src/app/sections');
const OUT_PATH = path.join(REPO_ROOT, 'apps/f-flow-portal/public/search-index.json');
const TMP_ROOT = path.join(REPO_ROOT, 'tmp');
const STUB_PATH = path.join(TMP_ROOT, 'm-render-stub.cjs');

const SECTION_REGISTRY = [
  { id: 'docs', routePath: '/docs', markdownDir: 'guides' },
  { id: 'examples', routePath: '/examples', markdownDir: 'examples' },
  { id: 'showcase', routePath: '/showcase', markdownDir: 'showcase' },
  { id: 'blog', routePath: '/blog', markdownDir: 'blog' },
];

// Must match the model used by the browser-side SearchService.
// `Xenova/all-MiniLM-L6-v2` outputs 384-dim sentence embeddings,
// quantised version is ~6 MB and fast on CPU/wasm.
const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';
// Each page is split into chunks of roughly this size before embedding.
// Smaller chunks = sharper semantic match for deep API references
// (`getState` deep in a long doc gets its own dedicated vector).
const CHUNK_TARGET_CHARS = 600;
const CHUNK_MAX_CHARS = 1200;

await main();

async function main() {
  const jiti = await createJitiLoader();
  const helpers = jiti(
    path.join(REPO_ROOT, 'libs/m-render/src/lib/documentation-page/page-config/derive-markdown-path.ts'),
  );
  const derivePageMarkdownPath = helpers.derivePageMarkdownPath;

  const documents = [];
  for (const section of SECTION_REGISTRY) {
    const pages = await loadSectionPages(jiti, section.id);
    for (const page of pages) {
      const doc = await preparePageDocument(section, page, derivePageMarkdownPath);
      if (doc) documents.push(doc);
    }
  }

  // Each page becomes 1..N chunks. A chunk owns its own embedding +
  // keyword text, so deep API references (e.g. `getState` in section 6
  // of a long reference page) get the same retrieval weight as the
  // page intro instead of being averaged into oblivion.
  const chunks = documents.flatMap((doc) =>
    chunkPage(doc).map((chunk, i) => ({
      ...doc,
      chunkId: `${doc.route}#${i}`,
      chunkIndex: i,
      embedSource: chunk.embedSource,
      keywords: chunk.keywords,
      excerpt: chunk.excerpt,
    })),
  );

  console.log(`Loading model ${MODEL_ID}...`);
  const modelStart = Date.now();
  const { pipeline } = await import('@huggingface/transformers');
  const extractor = await pipeline('feature-extraction', MODEL_ID, {
    dtype: 'q8',
  });
  console.log(`  ready in ${formatDuration(Date.now() - modelStart)}`);
  console.log(
    `Embedding ${chunks.length} chunks across ${documents.length} pages...`,
  );

  const indexed = [];
  const embedStart = Date.now();
  for (const [i, chunk] of chunks.entries()) {
    const output = await extractor(chunk.embedSource, { pooling: 'mean', normalize: true });
    indexed.push({
      chunkId: chunk.chunkId,
      slug: chunk.slug,
      route: chunk.route,
      section: chunk.section,
      title: chunk.title,
      description: chunk.description,
      group: chunk.group ?? null,
      vector: Array.from(output.data, (v) => Math.round(v * 1e5) / 1e5),
      keywords: chunk.keywords,
      excerpt: chunk.excerpt,
    });
    renderProgress(i + 1, chunks.length, embedStart);
  }
  process.stdout.write('\n');

  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  await writeFile(
    OUT_PATH,
    JSON.stringify(
      {
        model: MODEL_ID,
        dim: indexed[0]?.vector.length ?? 0,
        builtAt: new Date().toISOString(),
        documents: indexed,
      },
      null,
      0,
    ),
  );

  const sizeKb = Math.round((await readFile(OUT_PATH)).length / 1024);
  console.log(`\nWrote ${indexed.length} documents to ${path.relative(REPO_ROOT, OUT_PATH)} (${sizeKb} KB)`);
}

async function createJitiLoader() {
  await mkdir(TMP_ROOT, { recursive: true });
  await writeFile(
    STUB_PATH,
    `module.exports = {
  defineLazyComponent: (selector, loader) => ({ selector, component: loader }),
};
`,
  );

  const here = fileURLToPath(import.meta.url);
  const require = createRequire(here);
  const { createJiti } = require('jiti');

  return createJiti(here, {
    interopDefault: true,
    alias: { '@foblex/m-render': STUB_PATH },
  });
}

async function loadSectionPages(jiti, sectionId) {
  const file = path.join(SECTIONS_ROOT, sectionId, `${sectionId}.pages.ts`);
  const mod = jiti(file);
  const exportName = `${sectionId.toUpperCase()}_PAGES`;
  const pages = mod[exportName];
  if (!Array.isArray(pages)) {
    throw new Error(`Expected ${exportName} array in ${file}`);
  }
  return pages;
}

async function preparePageDocument(section, page, derivePageMarkdownPath) {
  if (typeof page.slug !== 'string' || /^https?:\/\//iu.test(page.slug)) {
    return null;
  }

  const relative = derivePageMarkdownPath(page);
  if (!relative) return null;

  const mdPath = path.join(MD_ROOT, section.markdownDir, relative);
  let mdContent;
  try {
    mdContent = await readFile(mdPath, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }

  const rawBody = stripFrontmatter(mdContent);
  const title = page.seo?.title ?? page.text ?? page.slug;
  const description = page.seo?.description ?? '';

  return {
    slug: page.slug,
    route: `${section.routePath}/${page.slug}`,
    section: section.id,
    title,
    description,
    group: page.group ?? null,
    rawBody,
  };
}

/**
 * Splits a page into searchable chunks. Each chunk is a section that
 * starts at an H2/H3 heading and runs until the next heading of equal
 * or shallower level. Long chunks are subdivided by paragraph until
 * they fit under CHUNK_MAX_CHARS. Every chunk carries the page title
 * + description as a prefix so the semantic context isn't lost in
 * deep sections.
 *
 * Returns at least one chunk per page even when the body is shorter
 * than the target size.
 */
function chunkPage(doc) {
  const sections = splitIntoSections(doc.rawBody);
  const sized = [];
  for (const section of sections) {
    if (section.length <= CHUNK_MAX_CHARS) {
      sized.push(section);
      continue;
    }
    const paragraphs = section.split(/\n{2,}/);
    let buffer = '';
    for (const paragraph of paragraphs) {
      if (buffer.length + paragraph.length > CHUNK_TARGET_CHARS && buffer) {
        sized.push(buffer);
        buffer = '';
      }
      buffer = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    }
    if (buffer) sized.push(buffer);
  }

  // Ensure every page contributes at least one chunk even if the body
  // is empty (front-matter-only pages).
  if (sized.length === 0) {
    sized.push('');
  }

  const titlePrefix = [doc.title, doc.description].filter(Boolean).join(' — ');
  return sized.map((rawChunk) => {
    const cleanedChunk = stripMarkdown(rawChunk);
    return {
      embedSource: [titlePrefix, cleanedChunk].filter(Boolean).join('\n\n'),
      // Full cleaned chunk text. The browser builds a focused snippet
      // around matched query tokens at render time so the highlight
      // is always visible inside the line-clamped excerpt area.
      excerpt: cleanedChunk,
      keywords: [
        doc.title,
        doc.title,
        doc.description,
        cleanedChunk,
        expandIdentifiers(cleanedChunk),
      ]
        .filter(Boolean)
        .join(' '),
    };
  });
}

function splitIntoSections(markdown) {
  // Split on lines starting with ## or ###. Preserve the heading line
  // with its content so the chunk text retains its semantic anchor.
  const lines = markdown.split('\n');
  const sections = [];
  let current = [];
  for (const line of lines) {
    if (/^#{2,3}\s+/.test(line) && current.length) {
      sections.push(current.join('\n').trim());
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) {
    sections.push(current.join('\n').trim());
  }
  return sections.filter(Boolean);
}

/**
 * Pulls camelCase / PascalCase / SCREAMING_CASE identifiers out of `text`
 * and emits them in space-separated form, e.g. `getState IFFlowState`
 * → `get State IF Flow State`. Returns just the expanded tokens so
 * adding it to the embed source doesn't double the prose; the original
 * identifiers stay in `body` for exact-token matches.
 */
function renderProgress(current, total, startedAt) {
  const elapsedMs = Date.now() - startedAt;
  const ratio = current / total;
  const etaMs = current > 0 ? Math.max(0, elapsedMs / ratio - elapsedMs) : 0;
  const barWidth = 30;
  const filled = Math.round(barWidth * ratio);
  const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);
  const pct = String(Math.round(ratio * 100)).padStart(3);
  const eta = current === total ? formatDuration(elapsedMs) : `eta ${formatDuration(etaMs)}`;
  const line = `  [${bar}] ${pct}%  ${current}/${total}  (${eta})`;
  // Use \r when stdout is a TTY (interactive terminal) so the bar updates
  // in place; in pipes (CI logs, npm capture) emit one line per tick so
  // each step is visible in the captured output.
  if (process.stdout.isTTY) {
    process.stdout.write(`\r${line}`);
  } else if (current === total || current % 10 === 0) {
    process.stdout.write(`${line}\n`);
  }
}

function formatDuration(ms) {
  const rounded = Math.round(ms);
  if (rounded < 1000) return `${rounded}ms`;
  const seconds = rounded / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return `${minutes}m ${remainder}s`;
}

function expandIdentifiers(text) {
  const seen = new Set();
  const out = [];
  const tokens = text.match(/[A-Za-z][A-Za-z0-9_-]+/g) || [];
  for (const token of tokens) {
    if (seen.has(token)) continue;
    seen.add(token);
    if (!/[A-Z]/.test(token) || token === token.toUpperCase()) continue;
    const split = token
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
    if (split !== token) out.push(split);
  }
  return out.join(' ');
}

function stripFrontmatter(md) {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

function stripMarkdown(md) {
  return md
    // Drop fenced code blocks — large noisy dumps that drown the prose signal.
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    // Keep inline code CONTENT (just remove the backticks). API identifiers
    // like `getState`, `f-flow`, `IFFlowState` are the strongest signal on
    // reference pages and must reach the embedding model.
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_>~|]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
