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
  let result = '';
  let needsSeparator = false;

  for (const char of value.toLowerCase()) {
    if (isAsciiAlphaNumeric(char)) {
      if (needsSeparator && result) {
        result += '-';
      }
      result += char;
      needsSeparator = false;
    } else if (result) {
      needsSeparator = true;
    }
  }

  return result;
}

function isAsciiAlphaNumeric(value: string): boolean {
  const code = value.charCodeAt(0);

  return (code >= 48 && code <= 57) || (code >= 97 && code <= 122);
}
