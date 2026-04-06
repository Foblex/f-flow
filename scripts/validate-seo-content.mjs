import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const MARKDOWN_ROOT = join(ROOT, 'public', 'markdown');
const SITEMAP_PATH = join(ROOT, 'public', 'sitemap.xml');
const CANONICAL_ORIGIN = 'https://flow.foblex.com';

const markdownFiles = walkMarkdownFiles(MARKDOWN_ROOT);
const sitemap = readFileSync(SITEMAP_PATH, 'utf8');
const issues = [];
const noindexRoutes = [];

for (const filePath of markdownFiles) {
  const content = readFileSync(filePath, 'utf8');

  if (/^noindex:\s*true\s*$/m.test(content)) {
    const route = toRoutePath(filePath);

    if (route) {
      noindexRoutes.push(route);
    }
  }
}

for (const route of noindexRoutes) {
  if (sitemap.includes(`<loc>${CANONICAL_ORIGIN}${route}</loc>`)) {
    issues.push(`public/sitemap.xml: noindex route ${route} must not appear in the sitemap`);
  }
}

if (issues.length) {
  console.error('SEO content validation failed:\n');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`SEO content validation passed for ${markdownFiles.length} markdown files.`);

function walkMarkdownFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files.sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs);
}

function toRoutePath(filePath) {
  const relativePath = relative(MARKDOWN_ROOT, filePath);
  const [section, ...rest] = relativePath.split(sep);
  const slug = basename(rest.join(sep), '.md');

  switch (section) {
    case 'guides':
      return `/docs/${slug}`;
    case 'examples':
      return `/examples/${slug}`;
    case 'blog':
      return `/blog/${slug}`;
    case 'showcase':
      return `/showcase/${slug}`;
    default:
      return null;
  }
}
