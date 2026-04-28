import { IPageDefinition } from './i-page-definition';

/**
 * Returns the markdown file path of a page, relative to the section's
 * `docsDir`. Pages with a `group` go into a kebab-cased subfolder named
 * after the group (e.g. group "Connections - Editing" -> "connections-editing");
 * pages without a group stay flat.
 *
 * Returns null for pages whose slug is an external URL (e.g. a sidebar
 * entry pointing at GitHub) — those have no markdown file.
 */
export function derivePageMarkdownPath(page: IPageDefinition): string | null {
  if (/^https?:\/\//iu.test(page.slug)) {
    return null;
  }

  const fileName = `${page.slug}.md`;
  if (!page.group) {
    return fileName;
  }

  return `${toKebabCase(page.group)}/${fileName}`;
}

function toKebabCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/giu, '-')
    .replace(/^-+|-+$/gu, '');
}
